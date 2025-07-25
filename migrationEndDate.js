const mongoose = require('mongoose');
const {CourseModel} = require('./src/models/Course.Model'); // adjust path to your Course model

const migrateEndDate = async () => {
  try {
    await mongoose.connect("mongodb+srv://jeetduke1234:71321@cluster0.ftuskdw.mongodb.net/?retryWrites=true&w=majority");

    const courses = await CourseModel.find({});

    for (const course of courses) {
      let updated = false;

      for (const subject of course.subjects) {
        for (const option of subject.options) {
          // Only update if at least one of the legacy fields is present
          if (option.end_date || option.ending_date) {
            option.endDate = option.end_date || option.ending_date || null;
            delete option.end_date;
            delete option.ending_date;
            updated = true;
          }
        }
      }

      if (updated) {
        await course.save();
        console.log(`✅ Updated course: ${course._id}`);
      }
    }

    console.log('🎉 Migration completed successfully');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
};

migrateEndDate();
