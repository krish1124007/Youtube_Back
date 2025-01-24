import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDNARY_API_KEY, 
    api_secret: process.env.CLOUDNARY_SECRET_KEY 
});

async function UploadToCloudNary(localfilepath)
{
    try {
        const uploadResult = await cloudinary.uploader
        .upload(
            localfilepath, {
                public_id: 'shoes',
            }
        )
        .catch((error) => {
            console.log("Error in Uploading Photo On the Cloudnry");
        });
     
     console.log(uploadResult);
    //  fs.unlinkSync(localfilepath)
     return  uploadResult;


    } catch (error) {
        console.log("Your File is not Uploding on the Cloudnary");
        fs.unlinkSync(localfilepath)
    }
}


async function DeleteFromCloudNary(CloudnaryPath)
{
  await  cloudinary.uploader
  .destroy(CloudnaryPath)
  .then(result => console.log(result));
  const response = "Image is Delted"
  return response;


}

export {UploadToCloudNary , DeleteFromCloudNary}