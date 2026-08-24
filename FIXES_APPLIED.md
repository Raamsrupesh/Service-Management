# Service Request Image Logic - Fixes Applied

## Issues Fixed

### 1. ✅ newServiceRequest Route Error
**Problem:** Incorrect destructuring of the `.returning()` result and missing error handling
**Solution:**
- Fixed destructuring to properly handle array response: `const service_req = await db.insert(...).returning();`
- Added validation for required fields (service_type, desc, address, phno)
- Improved error handling with proper checks for user existence
- Better error message in response

### 2. ✅ Missing Completion Image Field
**Problem:** Only one `image_url` field existed, couldn't capture worker completion photo
**Solution:**
- Added new column `completion_image_url` to servicesTable schema (nullable, default null)
- User uploads colony/problem photo when creating service request (stored in `image_url`)
- Worker uploads completion photo when marking task complete (stored in `completion_image_url`)

### 3. ✅ Worker Completion Task Logic
**Problem:** No file upload support and no completion image storage
**Solution:**
- Updated `completingAssignedTask()` to require file upload
- Added file upload validation with error message
- Added worker authorization check (ensures only assigned worker can complete)
- Stores completion image URL in `completion_image_url`
- Returns completion image path in response

### 4. ✅ Worker Routes Update
**Problem:** Completion endpoint didn't have file upload middleware
**Solution:**
- Added `upload.single("completion_image")` middleware to the completion route
- Route now accepts multipart form-data with completion_image field

### 5. ✅ Multer Configuration Enhancement
**Problem:** Single folder setup couldn't organize different types of uploads
**Solution:**
- Implemented dynamic folder structure based on fieldname
- Service request photos → `service-request` folder in Cloudinary
- Completion photos → `service-completion` folder in Cloudinary
- Default fallback → `user-uploads` folder

## Database Migration Required

Run the following to apply the schema changes:

```bash
npm run p
```

This will push the updated schema with the new `completion_image_url` column.

## API Endpoint Changes

### User Service Request
- **Endpoint:** `POST /api/user/v1/services/request`
- **Middleware:** `upload.single("image")`
- **Body:** Form-data with fields:
  - `image` (file) - Colony/problem photo
  - `service_type` (text)
  - `desc` (text)
  - `address` (text)
  - `phno` (text)

### Worker Task Completion
- **Endpoint:** `PATCH /api/worker/v1/requests/:id/complete`
- **Middleware:** `upload.single("completion_image")`
- **Body:** Form-data with fields:
  - `completion_image` (file) - Photo showing work completion
- **Response:** Includes `completion_image_url`

## Workflow Flow

1. **User creates service request:**
   - Uploads photo of colony/problem area
   - Photo stored in `image_url`
   - Status: PENDING

2. **Admin/Officer assigns worker:**
   - Worker assigned to request
   - Status: ASSIGNED

3. **Worker starts task:**
   - Endpoint: `PATCH /api/worker/v1/requests/:id/start`
   - Status: IN PROGRESS

4. **Worker completes task:**
   - Uploads photo proving work completion
   - Photo stored in `completion_image_url`
   - Status: COMPLETED

5. **User provides feedback:**
   - Endpoint: `POST /api/user/v1/services/feed/:service_id`
   - Only available when status is COMPLETED

## Testing Recommendations

1. Test user service request with image upload
2. Test worker completion with image upload
3. Verify both images are stored in separate Cloudinary folders
4. Confirm worker authorization check works
5. Validate file size limits (5MB max)
6. Test with different image formats (jpg, jpeg, png)

## Files Modified

1. `src/models/services.model.js` - Added completion_image_url field
2. `src/controllers/user.controller.js` - Fixed newServiceRequest function
3. `src/controllers/worker.controller.js` - Updated completingAssignedTask function
4. `src/routes/worker.router.js` - Added file upload middleware to completion route
5. `src/middlewares/multer.js` - Enhanced with dynamic folder structure
