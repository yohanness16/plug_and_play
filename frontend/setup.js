#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Zemenay Blog Frontend Setup');
console.log('================================\n');

const questions = [
  {
    name: 'apiUrl',
    question: 'Enter your backend API URL (default: http://localhost:3001): ',
    default: 'http://localhost:3001'
  },
  {
    name: 'supabaseUrl',
    question: 'Enter your Supabase URL: ',
    required: true
  },
  {
    name: 'supabaseKey',
    question: 'Enter your Supabase anonymous key: ',
    required: true
  },
  {
    name: 'appUrl',
    question: 'Enter your frontend app URL (default: http://localhost:3000): ',
    default: 'http://localhost:3000'
  }
];

const answers = {};

function askQuestion(index) {
  if (index >= questions.length) {
    createEnvFile();
    return;
  }

  const question = questions[index];
  rl.question(question.question, (answer) => {
    if (!answer && question.required) {
      console.log('❌ This field is required!');
      askQuestion(index);
      return;
    }

    answers[question.name] = answer || question.default;
    askQuestion(index + 1);
  });
}

function createEnvFile() {
  const envContent = `# Zemenay Blog Frontend Environment Variables
NEXT_PUBLIC_API_URL=${answers.apiUrl}
NEXT_PUBLIC_SUPABASE_URL=${answers.supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${answers.supabaseKey}
NEXT_PUBLIC_APP_URL=${answers.appUrl}
`;

  const envPath = path.join(process.cwd(), '.env.local');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Environment file created successfully!');
    console.log(`📁 File location: ${envPath}`);
    console.log('\n🎉 Setup complete! You can now run:');
    console.log('   npm run dev');
    console.log('\n📚 For more information, see README.md');
  } catch (error) {
    console.error('❌ Error creating environment file:', error.message);
  }

  rl.close();
}

// Start the setup process
askQuestion(0);
