import { v2 as cloudinary } from "cloudinary";
import { logger } from "./logger";
import ErrorHandler from "./Errorhandler";

export async function DeleteProfilePicture(
  avatar_public_id: string,
  user_id: string
) {
  await cloudinary.uploader
    .destroy(avatar_public_id)
    .then((result) => {
      console.log(result);
      logger.info(
        `User: ${user_id} profile image successfully deleted from cloudinary`
      );
    })
    .catch((error) => {
      logger.error(`Error while deleting profile image from cloudinary`, {
        action: "Cloudinary picture deletion",
        status: "failed",
      });
      throw new ErrorHandler(error.message, 500);
    });
}

export async function UploadProfilePicture(
  avatar: string
): Promise<{ avatar_public_id: string; avatar_url: string }> {
  let avatar_public_id = "";
  let avatar_url = "";

  const myCloud = await cloudinary.uploader.upload(avatar, {
    folder: "avatars",
  });
  avatar_public_id = myCloud.public_id;
  avatar_url = myCloud.secure_url;

  return { avatar_public_id, avatar_url };
}
