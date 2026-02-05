# AI Style Matching / Client Taste Decoder

A web app for interior designers that transforms messy client input into clear, structured style reports. Prevent late-stage design changes by aligning expectations early!

## What This App Does

Takes vague client descriptions like "I want something cozy but modern, maybe with plants" and generates a professional **Style Clarity Report** that includes:

- Primary design style identification
- Secondary influences
- Key design elements
- Potential contradictions (and how to resolve them)
- Design guardrails
- Avoid list
- Client-friendly approval summary

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Claude AI API** (Anthropic)
- **jsPDF & html2canvas** (for PDF export)

## Setup Instructions

### 1. Install Node.js

If you don't have Node.js installed:
- Go to [nodejs.org](https://nodejs.org/)
- Download the LTS (Long Term Support) version
- Run the installer

### 2. Get Your Claude API Key

- Go to [console.anthropic.com](https://console.anthropic.com/)
- Sign up or log in
- Navigate to "API Keys"
- Create a new API key and copy it

### 3. Set Up the Project

Open your terminal (Command Prompt on Windows, Terminal on Mac) and run these commands:

```bash
# Navigate to the project folder
cd style-decoder

# Install all dependencies (this might take a few minutes)
npm install

# Create your environment file
# On Mac/Linux:
cp .env.example .env

# On Windows:
copy .env.example .env
```

### 4. Add Your API Key

Open the `.env` file in a text editor and replace `your_api_key_here` with your actual Claude API key:

```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

### 5. Run the App

```bash
npm run dev
```

Open your browser and go to: **http://localhost:3000**

You should see the form! 🎉

## How to Use

1. **Fill out the form** with your client's project details
2. **Click "Generate Style Report"** - the AI will analyze the input (takes 5-10 seconds)
3. **Review the report** - you'll see a beautiful, structured analysis
4. **Export to PDF** - click the button to download a professional PDF

## Project Structure

```
style-decoder/
├── app/
│   ├── page.tsx           # Main form page
│   ├── report/
│   │   └── page.tsx       # Report display page
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts   # AI analysis API endpoint
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind config
└── .env                   # Your API key (don't share this!)
```

## Features

✅ Clean, professional form interface  
✅ AI-powered style analysis using Claude  
✅ Beautiful report generation  
✅ PDF export with signature section  
✅ Mobile-responsive design  
✅ Type-safe with TypeScript  

## Customization Ideas

Want to extend this? Here are some ideas:

- **Add image upload** for inspiration photos
- **Save reports** to a database
- **Email reports** to clients
- **Multiple report templates** for different project types
- **Comparison mode** to compare different style directions

## Troubleshooting

**"Module not found" error?**
- Run `npm install` again

**"API key not valid" error?**
- Double-check your `.env` file has the correct API key
- Make sure there are no spaces or quotes around the key

**Port already in use?**
- Try: `npm run dev -- -p 3001` to run on a different port

**PDF export not working?**
- Make sure you're using a modern browser (Chrome, Firefox, Safari, Edge)

## Cost Note

This app uses the Claude API which has usage costs. Each style analysis costs approximately $0.01-0.02 depending on input length. Monitor your usage at [console.anthropic.com](https://console.anthropic.com/).

## Next Steps

1. Test it with real client data
2. Share with your design team
3. Customize the prompts in `app/api/analyze/route.ts` to match your specific needs
4. Deploy to production (Vercel is easiest - just `npm run build` then deploy)

## Support

Built with Claude! If you need help:
- Check the [Next.js docs](https://nextjs.org/docs)
- Check the [Anthropic docs](https://docs.anthropic.com/)
- Modify the AI prompt in `app/api/analyze/route.ts` to get different outputs

---

Happy designing! 🎨
