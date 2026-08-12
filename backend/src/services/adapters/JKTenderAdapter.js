import { TenderSourceAdapter } from './TenderSourceAdapter.js';
import puppeteer from 'puppeteer';
import pino from 'pino';

const logger = pino();

export class JKTenderAdapter extends TenderSourceAdapter {
  constructor() {
    super('JK_TENDERS');
    this.rootUrl = 'https://jktenders.gov.in/nicgep/app';
  }

  // Added onPageScraped callback parameter here to support real-time streaming to the worker
  async fetchList(pageNumber = 1, filters = { syncMode: 'FULL' }, onPageScraped = null) {
    logger.info(`[Puppeteer HITL] Launching browser for J&K Portal in ${filters.syncMode || 'FULL'} mode...`);

    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
      logger.info(`[Puppeteer HITL] Hitting homepage to establish session...`);
      await page.goto(this.rootUrl, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(resolve => setTimeout(resolve, 3000));

      logger.info(`[Puppeteer HITL] Physically clicking the 'Advanced Search' link...`);
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
        page.evaluate(() => {
          const links = Array.from(document.querySelectorAll('a'));
          const advancedLink = links.find(l => l.textContent.trim().includes('Advanced Search'));
          if (advancedLink) advancedLink.click();
          else throw new Error("Advanced Search link not found.");
        })
      ]);

      logger.info(`[Puppeteer HITL] 🛑 Script is paused!`);
      logger.info(`[Puppeteer HITL] 👉 YOUR TURN: Select options, fill CAPTCHA, and click 'Search'.`);

      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 0 });
      await page.waitForSelector('table.list_table', { visible: true, timeout: 60000 });
      
      logger.info(`[Puppeteer HITL] ✅ First results page loaded! Starting full multi-page traversal loop...`);

      let totalExtractedCount = 0;
      let hasNextPage = true;
      let currentPage = 1;
      
      const today = new Date();
      const todayString = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');

      while (hasNextPage) {
        logger.info(`[Puppeteer HITL] Extracting Data from Page ${currentPage}...`);

        await page.waitForSelector('table.list_table tbody tr', { visible: true, timeout: 10000 });

        const pageData = await page.evaluate((currPage) => {
          const extractedData = [];
          const rows = document.querySelectorAll('table.list_table tbody tr');

          rows.forEach((row, index) => {
            if (index === 0) return; // Skip headers
            
            const tds = row.querySelectorAll('td');
            if (tds.length >= 6) {
              const titleCell = tds[4];
              const titleAnchor = titleCell.querySelector('a');
              const detailsUrl = titleAnchor ? titleAnchor.href : null;
              
              const rawTitle = titleAnchor ? titleAnchor.innerText.trim() : titleCell.innerText.trim();
              
              const fullCellText = titleCell.innerText.trim();
              const bracketMatches = fullCellText.match(/\[(.*?)\]/g) || [];
              
              const tenderId = bracketMatches.length >= 2 ? bracketMatches[bracketMatches.length - 1].replace(/[\[\]]/g, '') : '';
              const referenceNo = bracketMatches.length >= 2 ? bracketMatches[bracketMatches.length - 2].replace(/[\[\]]/g, '') : '';

              const orgChainRaw = tds[5].innerText.trim();
              const orgParts = orgChainRaw.split('||').map(part => part.trim());
              const department = orgParts.length > 0 ? orgParts[0] : '';
              const location = orgParts.length > 1 ? orgParts[orgParts.length - 1] : 'Jammu and Kashmir';

              extractedData.push({
                title: rawTitle,
                detailsUrl: detailsUrl,
                referenceNo: referenceNo,
                sourceTenderId: tenderId || referenceNo || `JK-TENDER-${currPage}-${index}-${Date.now()}`,
                department: department,
                location: location,
                organisationChain: orgChainRaw,
                publishedDate: tds[1].innerText.trim(),
                closingDate: tds[2].innerText.trim(),
                openingDate: tds[3].innerText.trim(),
              });
            }
          });
          return extractedData;
        }, currentPage);

        totalExtractedCount += pageData.length;
        logger.info(`[Puppeteer HITL] Extracted ${pageData.length} items from Page ${currentPage}. Total processed so far: ${totalExtractedCount}`);

        // --- REAL-TIME STREAMING HOOK: SEND PAGE DATA DIRECTLY TO WORKER FOR DB INSERTION ---
        if (onPageScraped && pageData.length > 0) {
          await onPageScraped(pageData);
        }

        if (filters.syncMode === 'DAILY') {
          const lastItem = pageData[pageData.length - 1];
          if (lastItem && lastItem.publishedDate && !lastItem.publishedDate.includes(todayString)) {
            logger.info(`[Puppeteer HITL] Daily Sync: Reached tenders older than today. Stopping pagination.`);
            break; 
          }
        }

        // --- SMART BLOCK-EXPANSION PAGINATION (HANDLES PAGE 30+ SHIFTS) ---
        const nextTargetPage = currentPage + 1;
        hasNextPage = await page.evaluate((targetPg) => {
          const links = Array.from(document.querySelectorAll('a'));
          
          let targetLink = links.find(l => l.textContent.trim() === String(targetPg));
          if (targetLink) {
            targetLink.click();
            return true;
          }

          const expandBtn = links.find(l => {
            const txt = l.textContent.trim();
            if (txt.includes('>>')) return false;
            return txt === '...' || txt === '>' || txt.toLowerCase().includes('next');
          });

          if (expandBtn) {
            expandBtn.click();
            return true;
          }

          return false;
        }, nextTargetPage);

        if (hasNextPage) {
          currentPage++;
          logger.info(`[Puppeteer HITL] Moving sequentially to Page ${currentPage}...`);
          
          try {
            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 });
          } catch (navError) {
            await new Promise(resolve => setTimeout(resolve, 4000));
          }
        }
      }

      logger.info(`[Puppeteer HITL] Scraping Complete! Total tenders collected across all pages: ${totalExtractedCount}`);
      await browser.close();
      return [];

    } catch (error) {
      logger.error(`[Puppeteer HITL] Error: ${error.message}`);
      await browser.close();
      throw error;
    }
  }

  async fetchDetail(sourceTenderId) { return {}; }

  normalize(rawTenderData) {
    const parsePortalDate = (dateStr) => {
      if (!dateStr) return new Date();
      const cleanedDate = dateStr.replace(/-/g, ' ');
      const timestamp = Date.parse(cleanedDate);
      return !isNaN(timestamp) ? new Date(timestamp) : new Date();
    };

    return {
      title: rawTenderData.title,
      sourcePortal: this.portalName,
      sourceTenderId: rawTenderData.sourceTenderId,
      referenceNo: rawTenderData.referenceNo,
      department: rawTenderData.department,
      location: rawTenderData.location,
      detailsUrl: rawTenderData.detailsUrl,
      organisationChain: rawTenderData.organisationChain,
      publishedDate: parsePortalDate(rawTenderData.publishedDate),
      closingDate: parsePortalDate(rawTenderData.closingDate),
      openingDate: parsePortalDate(rawTenderData.openingDate),
      status: 'ACTIVE'
    };
  }
}