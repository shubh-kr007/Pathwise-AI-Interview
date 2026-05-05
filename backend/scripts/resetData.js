const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");


dotenv.config({ path: path.join(__dirname, "../.env") });

async function resetAllData() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI not found in .env");
    process.exit(1);
  }

  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("✅ Connected.");

    // 1. Delete all interview attempts
    console.log("🗑️ Deleting all InterviewAttempt records...");
    const attemptResult = await mongoose.connection.collection("interviewattempts").deleteMany({});
    console.log(`✅ Deleted ${attemptResult.deletedCount} attempts.`);

    // 2. Reset all user stats
    console.log("🧹 Resetting all User stats...");
    const userResult = await mongoose.connection.collection("users").updateMany(
      {},
      {
        $set: {
          interviewsCompleted: 0,
          averageScore: 0,
          resumeAnalyzed: false,
          resumeData: null
        }
      }
    );
    console.log(`✅ Reset stats for ${userResult.modifiedCount} users.`);

    console.log("\n✨ DATABASE HARD RESET COMPLETE. All data points are now 0.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Reset failed:", error);
    process.exit(1);
  }
}

resetAllData();
