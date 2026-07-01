// ============================================================
// backend/config/migrate_phase3.js
// Database Migration for Phase 3 Daily Challenges
// ============================================================
'use strict';

const db = require('./db');

async function migrate() {
  console.log('🏁 Starting Phase 3 database migration...');

  try {
    // 1. Table: daily_challenges
    await db.query(`
      CREATE TABLE IF NOT EXISTS daily_challenges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        difficulty VARCHAR(20) NOT NULL,
        category VARCHAR(50) NOT NULL,
        xp_reward INT DEFAULT 100,
        expected_time_mins INT DEFAULT 30,
        acceptance_rate DECIMAL(5,2) DEFAULT 75.00,
        hints TEXT,
        optimal_solution TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `daily_challenges` checked/created.');

    // 2. Table: challenge_test_cases
    await db.query(`
      CREATE TABLE IF NOT EXISTS challenge_test_cases (
        id INT AUTO_INCREMENT PRIMARY KEY,
        challenge_id INT NOT NULL,
        input_data TEXT,
        expected_output TEXT NOT NULL,
        is_hidden TINYINT(1) DEFAULT 0,
        explanation TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (challenge_id) REFERENCES daily_challenges(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `challenge_test_cases` checked/created.');

    // 3. Table: challenge_submissions
    await db.query(`
      CREATE TABLE IF NOT EXISTS challenge_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        challenge_id INT NOT NULL,
        language VARCHAR(50) NOT NULL,
        source_code TEXT NOT NULL,
        status VARCHAR(50) NOT NULL,
        execution_time_ms INT DEFAULT 0,
        memory_usage_kb INT DEFAULT 0,
        xp_awarded INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (challenge_id) REFERENCES daily_challenges(id) ON DELETE CASCADE,
        KEY idx_user_challenge (user_id, challenge_id),
        KEY idx_language (language),
        KEY idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `challenge_submissions` checked/created.');

    // 4. Table: saved_code
    await db.query(`
      CREATE TABLE IF NOT EXISTS saved_code (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        challenge_id INT DEFAULT NULL,
        filename VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        language VARCHAR(50) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (challenge_id) REFERENCES daily_challenges(id) ON DELETE SET NULL,
        UNIQUE KEY uq_user_challenge_file (user_id, challenge_id, filename)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `saved_code` checked/created.');

    // 5. Table: challenge_bookmarks
    await db.query(`
      CREATE TABLE IF NOT EXISTS challenge_bookmarks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        challenge_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (challenge_id) REFERENCES daily_challenges(id) ON DELETE CASCADE,
        UNIQUE KEY uq_user_bookmark (user_id, challenge_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `challenge_bookmarks` checked/created.');

    // Seed Standard Daily Challenges
    const sampleChallenges = [
      {
        id: 1,
        title: 'Two Sum JS Challenge',
        description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
        difficulty: 'Easy',
        category: 'Arrays',
        xp_reward: 100,
        expected_time_mins: 20,
        acceptance_rate: 80.50,
        hints: '["Try a brute force search", "Use a hashmap to record values indices"]',
        optimal_solution: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n}'
      },
      {
        id: 2,
        title: 'Reverse String Python',
        description: 'Write a function that reverses a string in-place.',
        difficulty: 'Easy',
        category: 'Strings',
        xp_reward: 100,
        expected_time_mins: 15,
        acceptance_rate: 90.00,
        hints: '["Use two pointers", "Swap characters from left to right"]',
        optimal_solution: 'def reverseString(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1'
      },
      {
        id: 3,
        title: 'Find High Earners Query',
        description: 'Write a SQL query to find names of all employees who earn more than 100,000.',
        difficulty: 'Easy',
        category: 'Database',
        xp_reward: 100,
        expected_time_mins: 15,
        acceptance_rate: 95.00,
        hints: '["Use a WHERE clause", "Select the name column"]',
        optimal_solution: 'SELECT name FROM employees WHERE salary > 100000;'
      }
    ];

    for (const c of sampleChallenges) {
      await db.query(`
        INSERT INTO daily_challenges (id, title, description, difficulty, category, xp_reward, expected_time_mins, acceptance_rate, hints, optimal_solution)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          description = VALUES(description),
          difficulty = VALUES(difficulty),
          category = VALUES(category),
          xp_reward = VALUES(xp_reward),
          expected_time_mins = VALUES(expected_time_mins),
          acceptance_rate = VALUES(acceptance_rate),
          hints = VALUES(hints),
          optimal_solution = VALUES(optimal_solution)
      `, [c.id, c.title, c.description, c.difficulty, c.category, c.xp_reward, c.expected_time_mins, c.acceptance_rate, c.hints, c.optimal_solution]);
    }
    console.log('   ✓ Seeded daily challenges.');

    // Seed sample test cases
    const sampleTestCases = [
      { challenge_id: 1, input_data: '[2, 7, 11, 15], 9', expected_output: '[0, 1]', is_hidden: 0, explanation: '2 + 7 = 9' },
      { challenge_id: 2, input_data: '["h","e","l","l","o"]', expected_output: '["o","l","l","e","h"]', is_hidden: 0, explanation: 'reverses characters list' },
      { challenge_id: 3, input_data: '', expected_output: 'John, Alice', is_hidden: 0, explanation: 'employees names' }
    ];

    for (const tc of sampleTestCases) {
      await db.query(`
        INSERT IGNORE INTO challenge_test_cases (challenge_id, input_data, expected_output, is_hidden, explanation)
        VALUES (?, ?, ?, ?, ?)
      `, [tc.challenge_id, tc.input_data, tc.expected_output, tc.is_hidden, tc.explanation]);
    }
    console.log('   ✓ Seeded challenge test cases.');

    console.log('✅ Phase 3 database migration completed successfully.');
  } catch (err) {
    console.error('❌ Phase 3 database migration failed:', err.message);
    throw err;
  }
}

module.exports = { migrate };
