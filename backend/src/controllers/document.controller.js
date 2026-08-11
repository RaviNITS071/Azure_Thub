import CompanyDocument from '../models/CompanyDocument.js';

export const getPresignedUrl = async (req, res, next) => {
  try {
    const { fileName, fileType } = req.body;
    
    // In a real production environment, you would use the AWS SDK here to generate an S3 presigned URL.
    // We are mocking the response so your frontend development is unblocked.
    const mockUploadUrl = `https://mock-s3-bucket.s3.amazonaws.com/uploads/${Date.now()}-${fileName}`;
    const mockFileUrl = mockUploadUrl.split('?')[0]; // The clean URL to save in the DB after upload

    res.status(200).json({
      uploadUrl: mockUploadUrl,
      fileUrl: mockFileUrl
    });
  } catch (error) {
    next(error);
  }
};

export const confirmDocumentUpload = async (req, res, next) => {
  try {
    const { title, url, type } = req.body;
    
    const document = await CompanyDocument.create({
      organizationId: req.organizationId,
      title,
      url,
      type
    });
    
    res.status(201).json({ message: 'Document saved successfully', document });
  } catch (error) {
    next(error);
  }
};