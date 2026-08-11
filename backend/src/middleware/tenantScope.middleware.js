export const enforceTenantScope = (req, res, next) => {
  if (!req.organizationId) {
    return res.status(401).json({ error: 'Tenant context missing.' });
  }

  // Inject organizationId into the query or body to ensure DB queries are always scoped
  if (req.method === 'GET') {
    req.query.organizationId = req.organizationId;
  } else if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    req.body.organizationId = req.organizationId;
  }

  next();
};