import mongoose, { Document, Model, Schema, model } from "mongoose";

const announcementSchema = new Schema<IAnnouncement>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  date: Date;
  image: string;
}

export interface IAnnouncementModel extends Model<IAnnouncement> {
  createAnnouncement(
    title: string,
    content: string,
    date: Date,
    image: string
  ): Promise<IAnnouncement | null>;
}

announcementSchema.statics.createAnnouncement = async function (
  title: string,
  content: string,
  date: Date,
  image: string
): Promise<IAnnouncement | null> {
  const announcement = await this.create({
    title,
    content,
    date,
    image,
  });
  return announcement;
};

const Announcement: IAnnouncementModel = (mongoose.models.Announcement ||
  mongoose.model<IAnnouncement, IAnnouncementModel>(
    "Announcement",
    announcementSchema
  )) as IAnnouncementModel;
export default Announcement;
