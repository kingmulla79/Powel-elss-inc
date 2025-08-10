import { v2 as cloudinary } from "cloudinary";
import { logger } from "./logger";
import ErrorHandler from "./Errorhandler";
import { redis } from "./Redis";

export async function DeleteProfilePicture(
  avatar_public_id: string,
  user_id: string
) {
  await cloudinary.uploader
    .destroy(avatar_public_id)
    .then((result) => {
      logger.info(
        `User: ${user_id} profile image successfully deleted from cloudinary`
      );
    })
    .catch((error) => {
      logger.error(`Error while deleting profile image from cloudinary`);
      throw new ErrorHandler(error.message, 500);
    });
  await redis.del(user_id).then((result) => {
    logger.info("User cache successfully cleared");
  });
}
