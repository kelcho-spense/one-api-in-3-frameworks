-- Enable the 'sa' account and reset password
ALTER LOGIN sa ENABLE;
ALTER LOGIN sa WITH PASSWORD = '5472';
GO