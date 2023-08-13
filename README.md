# Drive Clone

A Google Drive clone implementing the features that focus on the app's streaming capabilities.

## Features

- [x] User should be able to upload a file to the server
- [x] User should be able to see if upload is complete
- [x] User should be able to see upload progress
- [x] User should be able to cancel upload
- [x] User should be able to delete the uploaded file
- [ ] User should see an error if anything goes wrong with the upload
- [ ] User should be able to see a list of uploaded files
- [ ] User should be able to download a file from the list
- [ ] User should be able to delete files from the list
- [ ] User should be able to upload multiple files at once
- [ ] User should see a progress bar for each file being uploaded
- [ ] User should see file size, disk usage and network usage allowance limits
- [ ] User should see an error if maximum file size is exceeded
- [ ] User should see an error if file exceeds disk usage limit
- [ ] User should see an error if file exceeds network usage allowance limit

## Security

- [ ] User should not be able to see what other users uploaded
- [ ] User should not be able to delete other users files
- [ ] User should not be able to upload a file bigger than file size limit
- [ ] User should not be able to upload a file is disk usage limit is going to be exceed
- [ ] User should not be able to upload a file if network usage limit is going to be reached

## System Features

- [ ] Progress update should be throttled to a minimum of 200ms interval between updates
- [ ] Maximum file size should be configurable
- [ ] Maximum disk use per user should be configurable
- [ ] Maximum network use per user should be configurable
