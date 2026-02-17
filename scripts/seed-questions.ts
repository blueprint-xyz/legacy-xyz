import mongoose from "mongoose";
import Question from "../core/db/models/question";

const PHASE_NAMES: Record<number, string> = {
    1: "Roots & Early Childhood",
    2: "Adolescence & Identity Formation",
    3: "Early Adulthood & Independence",
    4: "Relationships, Love, & Partnerships",
    5: "Parenthood & Family Legacy",
    6: "Career, Craft, & Contribution",
    7: "Trials, Resilience, & Wisdom",
    8: "Values & Digital Twin Essence",
};

const QUESTIONS: { phase: number; order: number; text: string }[] = [
    // Phase 1: Roots & Early Childhood (Ages 0-12)
    { phase: 1, order: 1, text: "What is your very first memory, even if it's just a flash of color or a sound?" },
    { phase: 1, order: 2, text: "Can you describe the house you grew up in? What did it smell like?" },
    { phase: 1, order: 3, text: "What was your favorite toy as a child, and why did you love it?" },
    { phase: 1, order: 4, text: "Who was the first person you felt truly safe with?" },
    { phase: 1, order: 5, text: "What was a typical Sunday morning like in your household?" },
    { phase: 1, order: 6, text: "Describe your childhood bedroom in detail." },
    { phase: 1, order: 7, text: "What was your favorite meal that your parents or guardians made?" },
    { phase: 1, order: 8, text: 'Were you a quiet child, or were you a "handful"?' },
    { phase: 1, order: 9, text: "What did your parents do for a living, and how did that affect your family life?" },
    { phase: 1, order: 10, text: "What is a family story about you that gets told at every holiday?" },
    { phase: 1, order: 11, text: "Who was your best friend in elementary school?" },
    { phase: 1, order: 12, text: "What was the biggest trouble you ever got into as a kid?" },
    { phase: 1, order: 13, text: "Did you have any pets growing up? Tell me their names and personalities." },
    { phase: 1, order: 14, text: "What was the first book or movie that made a deep impression on you?" },
    { phase: 1, order: 15, text: "What did you want to be when you grew up at age 8?" },

    // Phase 2: Adolescence & Identity Formation (Ages 13-19)
    { phase: 2, order: 1, text: "How did your personality change when you hit your teenage years?" },
    { phase: 2, order: 2, text: 'What was the "cool" thing to do or wear when you were in high school?' },
    { phase: 2, order: 3, text: "Who was a teacher that changed the way you saw the world?" },
    { phase: 2, order: 4, text: "Describe your first crush. What was that feeling like?" },
    { phase: 2, order: 5, text: "What kind of music did you listen to when you were sad?" },
    { phase: 2, order: 6, text: "What was your first job, and what did you buy with your first paycheck?" },
    { phase: 2, order: 7, text: "Did you have a favorite hiding spot or place to think?" },
    { phase: 2, order: 8, text: "What was your relationship with your siblings like during these years?" },
    { phase: 2, order: 9, text: "What was the most rebellious thing you did as a teenager?" },
    { phase: 2, order: 10, text: "Tell me about your first car or how you used to get around." },
    { phase: 2, order: 11, text: "What was your greatest fear during high school?" },
    { phase: 2, order: 12, text: "When did you first feel like an adult?" },
    { phase: 2, order: 13, text: "Describe your high school graduation day." },
    { phase: 2, order: 14, text: "What was the hardest lesson you learned as a teenager?" },
    { phase: 2, order: 15, text: "If you could go back and tell your 16-year-old self one thing, what would it be?" },

    // Phase 3: Early Adulthood & Independence (Ages 20-30)
    { phase: 3, order: 1, text: "What was the first place you lived in away from your parents?" },
    { phase: 3, order: 2, text: 'Tell me about the "starving artist" or "struggling student" phase of your life.' },
    { phase: 3, order: 3, text: "How did you choose your career path? Was it a choice or an accident?" },
    { phase: 3, order: 4, text: "What was the most significant world event that happened in your 20s?" },
    { phase: 3, order: 5, text: "Who was the most influential mentor you had in your early career?" },
    { phase: 3, order: 6, text: "Tell me about a friendship from this era that has lasted a lifetime." },
    { phase: 3, order: 7, text: "What was your favorite way to spend a Saturday night in your 20s?" },
    { phase: 3, order: 8, text: "When did you first experience true heartbreak?" },
    { phase: 3, order: 9, text: "What was the most spontaneous trip you ever took?" },
    { phase: 3, order: 10, text: "What was the biggest risk you took during this decade?" },
    { phase: 3, order: 11, text: "How did your relationship with your parents change once you became an adult?" },
    { phase: 3, order: 12, text: "Tell me about a time you failed miserably and how you bounced back." },
    { phase: 3, order: 13, text: 'What was your "signature" look or style during this time?' },
    { phase: 3, order: 14, text: 'What did you think "success" looked like back then?' },
    { phase: 3, order: 15, text: "What is one thing you miss about being 25?" },

    // Phase 4: Relationships, Love, & Partnerships
    { phase: 4, order: 1, text: "How did you meet your long-term partner or spouse?" },
    { phase: 4, order: 2, text: "What was your first impression of them?" },
    { phase: 4, order: 3, text: "Describe your first date in detail." },
    { phase: 4, order: 4, text: "When did you realize you were in love?" },
    { phase: 4, order: 5, text: "Tell me about your wedding day or the day you committed to each other." },
    { phase: 4, order: 6, text: "What is the secret to a long-lasting relationship, in your opinion?" },
    { phase: 4, order: 7, text: "How do you and your partner handle disagreements?" },
    { phase: 4, order: 8, text: "What is the most romantic thing anyone has ever done for you?" },
    { phase: 4, order: 9, text: "How did you support each other through a major life crisis?" },
    { phase: 4, order: 10, text: 'If you never married, who was the "great love" of your life?' },
    { phase: 4, order: 11, text: "What did you learn about yourself through your relationships?" },
    { phase: 4, order: 12, text: 'How has your definition of "love" changed over the decades?' },
    { phase: 4, order: 13, text: "What is a small daily habit you share with your partner?" },
    { phase: 4, order: 14, text: "What was the hardest part of merging two lives into one?" },
    { phase: 4, order: 15, text: "What advice would you give to a couple getting married today?" },

    // Phase 5: Parenthood & Family Legacy
    { phase: 5, order: 1, text: "What was the moment you found out you were going to be a parent?" },
    { phase: 5, order: 2, text: "Describe the day your first child was born." },
    { phase: 5, order: 3, text: "What was the most surprising thing about being a new parent?" },
    { phase: 5, order: 4, text: "How did you choose your children's names?" },
    { phase: 5, order: 5, text: "What was a tradition you started with your own children?" },
    { phase: 5, order: 6, text: "What personality traits did your children inherit from you?" },
    { phase: 5, order: 7, text: "What was the most difficult stage of parenting for you?" },
    { phase: 5, order: 8, text: "What is the proudest moment you've had as a parent?" },
    { phase: 5, order: 9, text: "How did you balance work and family life?" },
    { phase: 5, order: 10, text: "What is one thing you hope your children never forget about you?" },
    { phase: 5, order: 11, text: "Who are the younger people in your life you've mentored?" },
    { phase: 5, order: 12, text: "What was it like seeing your children become adults?" },
    { phase: 5, order: 13, text: "What is your favorite thing to do with your grandchildren?" },
    { phase: 5, order: 14, text: "What family values were most important for you to pass down?" },
    { phase: 5, order: 15, text: "What is the most important lesson your children taught you?" },

    // Phase 6: Career, Craft, & Contribution
    { phase: 6, order: 1, text: "What was the high point of your professional life?" },
    { phase: 6, order: 2, text: 'Describe a typical "day at the office" during your peak working years.' },
    { phase: 6, order: 3, text: "What was a project or achievement you poured your soul into?" },
    { phase: 6, order: 4, text: "How did you handle workplace politics or difficult bosses?" },
    { phase: 6, order: 5, text: "What was the biggest professional sacrifice you ever made?" },
    { phase: 6, order: 6, text: "If you could have had any other career, what would it have been?" },
    { phase: 6, order: 7, text: 'What does "hard work" mean to you?' },
    { phase: 6, order: 8, text: "Tell me about a time you had to stand up for what was right at work." },
    { phase: 6, order: 9, text: "How did you handle retirement?" },
    { phase: 6, order: 10, text: "What do you want to be remembered for in your field?" },

    // Phase 7: Trials, Resilience, & Wisdom
    { phase: 7, order: 1, text: "What was the darkest period of your life, and how did you find the light?" },
    { phase: 7, order: 2, text: "Tell me about a loss that changed you forever." },
    { phase: 7, order: 3, text: "How do you deal with physical pain or aging?" },
    { phase: 7, order: 4, text: "What is the most difficult decision you ever had to make?" },
    { phase: 7, order: 5, text: "What is your greatest regret, and have you made peace with it?" },
    { phase: 7, order: 6, text: "What is the most important thing you've learned about human nature?" },
    { phase: 7, order: 7, text: "How do you find hope when things look bleak?" },
    { phase: 7, order: 8, text: "What is the bravest thing you've ever done?" },
    { phase: 7, order: 9, text: "When have you been most proud of yourself?" },
    { phase: 7, order: 10, text: "What is the secret to a meaningful life?" },

    // Phase 8: Values & "Digital Twin" Essence
    { phase: 8, order: 1, text: "How would you describe your sense of humor?" },
    { phase: 8, order: 2, text: "What are three words your closest friends would use to describe you?" },
    { phase: 8, order: 3, text: 'What is a "phrase" or "saying" that you find yourself repeating often?' },
    { phase: 8, order: 4, text: "Do you believe in an afterlife or a higher power?" },
    { phase: 8, order: 5, text: "What is your political or social philosophy in one sentence?" },
    { phase: 8, order: 6, text: "What is your most cherished possession that has no monetary value?" },
    { phase: 8, order: 7, text: "What do you think is the most beautiful thing in the world?" },
    { phase: 8, order: 8, text: "If you could sit down with any ancestor, who would it be and what would you ask?" },
    { phase: 8, order: 9, text: "What is the one thing you want the world to know about you?" },
    { phase: 8, order: 10, text: 'If your "Digital Twin" were to give a message to your great-grandchildren, what would it be?' },
];

async function seed() {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("❌ MONGO_URI not set. Run: npx vercel env pull .env.local");
        process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("🔌 Connected to MongoDB");

    // Clear existing questions
    const deleted = await Question.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.deletedCount} existing questions`);

    // Insert with phase names
    const docs = QUESTIONS.map((q) => ({
        ...q,
        phaseName: PHASE_NAMES[q.phase],
        isActive: true,
    }));

    await Question.insertMany(docs);
    console.log(`✅ Seeded ${docs.length} questions across ${Object.keys(PHASE_NAMES).length} phases`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
