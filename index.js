const express = require("express")
const axios = require("axios")
const cors = require("cors")
require("dotenv").config();

const app = express();

app.use(express.json())
app.use(cors());

app.post("/convert",async(req,res)=>{
    const { code, targetLang } = req.body;
  const apiKey = process.env.YOUR_OPENAI_API_KEY; // Replace this with your OpenAI API key
  // const prompt=`what is ${code} and ${targetLang}`
  const prompt=`Translate the following code to ${targetLang}:\n${code} and only respond with converted code`
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      messages:[{"role":"user","content":prompt}],
      model:"gpt-3.5-turbo",
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const convertedCode = response.data.choices[0].message.content;
    res.status(200).json({ convertedCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
})

app.post("/debug",async(req,res)=>{
  const { code } = req.body;
  const apiKey = process.env.YOUR_OPENAI_API_KEY;; // Replace this with your OpenAI API key
  const prompt=`Debug the following ${code} and provide possible solution`
  try {
    const response = await axios.post('https://api.openai.com/v1/chat//completions', {
      messages:[{"role":"user","content":prompt}],
      model:"gpt-3.5-turbo",
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const debugOutput = response.data.choices[0].message.content;
    res.status(200).json({ debugOutput });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error debugging code' });
  }
})

app.post("/quality",async(req,res)=>{
  const { code } = req.body;
  const apiKey = process.env.YOUR_OPENAI_API_KEY; // Replace this with your OpenAI API key
  const prompt= `Perform a quality check on the following code:\n${code} and response should have overall summary of code quanlity. 
  Also evaluate the code based on Code consistency, Code performance, Code documentation, Error handling, Code testability,
  Code modularity, Code complexity, Code duplication, Code readability. Also provide a score out of 10 for every evaluation.`
  try {
    const response = await axios.post('https://api.openai.com/v1/chat//completions', {
      messages:[{"role":"user","content":prompt}],
      model:"gpt-3.5-turbo",
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const qualityCheckOutput = response.data.choices[0].message.content;
    res.status(200).json({ qualityCheckOutput });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error performing quality check' });
  }
})

app.listen(3000,()=>{
    console.log("server in running at port 3000")
})