
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

// Self-contained type definitions to avoid issues with relative path imports in some serverless environments.
interface ReadingRequest {
  name: string;
  age: number | null;
  gender: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
  prompt: string;
  readingType: string; // Using string type for robustness on the backend.
  isPremium: boolean;
}

interface ReadingResponse {
  text: string;
  imageUrl?: string;
}


if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getPromptDetails = (request: ReadingRequest): { systemInstruction: string, fullPrompt: string } => {
  const { name, age, gender, prompt, readingType, isPremium } = request;
  const hasPrompt = prompt && prompt.trim() !== '';

  let systemInstruction = `You are 'Scarlett', a wise and insightful psychic reader. Begin each reading by warmly thanking the client by name for their Etsy purchase and trust in you. Your goal is to provide clear, empathetic, and empowering guidance. Your tone should be serene and supportive. It is crucial that you never provide direct medical, financial, or legal advice. Always frame your insights as possibilities and perspectives, not as absolute facts. Your readings should be uplifting, even when discussing challenges. Ensure your response is plain text, with paragraphs separated by line breaks. Do not use any markdown formatting (like asterisks or hashtags).`;
  let fullPrompt = '';

  switch (readingType) {
    // New Readings
    case 'CORD-CUTTING GUIDANCE READING':
      systemInstruction += ' Your guidance should be empowering, focusing on reclaiming personal energy and peace.';
      fullPrompt = `Client: ${name}, seeks to cut energetic cords. ${hasPrompt ? `Their situation is: "${prompt}".` : 'They are seeking general guidance on releasing a connection that no longer serves them.'} Provide a compassionate but firm reading on how to visualize and perform an energetic cord-cutting. Offer guidance on what to expect after the cord is cut and how to maintain their energetic sovereignty.`;
      break;
    case 'CLAIM YOUR POWER BACK GUIDANCE READING':
      systemInstruction += ' Your tone is that of a powerful, encouraging mentor. The goal is to help the client reclaim their inner strength and autonomy.';
      fullPrompt = `Client: ${name}, seeks to claim their power back. ${hasPrompt ? `They've described their situation: "${prompt}".` : 'They are feeling disempowered and are seeking guidance.'} Provide an empowering reading that identifies where they may be giving their power away. Offer actionable spiritual guidance and affirmations to help them reclaim their sovereignty, rebuild their confidence, and step into their authentic self.`;
      break;
    case 'TURKISH COFFEE CUP READING - BREW YOURSELF':
      systemInstruction = 'You are \'Scarlett\', an expert in tasseography (Turkish coffee reading). Your interpretations are symbolic and intuitive. Thank the client by name for their purchase.';
      fullPrompt = `Client: ${name}, has requested a Turkish coffee cup reading. ${hasPrompt ? `They have described the symbols and shapes they see in their cup: "${prompt}".` : 'They have not described any symbols.'} ${hasPrompt ? 'Based on the symbols they provided, interpret their meaning in relation to their life path, hidden desires, and near future. Weave a story from the symbols.' : 'Please gently instruct the client that for this reading to work, they need to describe the symbols, shapes, or images they see in their coffee grounds. Then, provide a short, general reading about intuition and seeing signs in everyday life as a placeholder.'}`;
      break;
    case 'WATER SCRYING READING':
      systemInstruction = 'You are \'Scarlett\', a water scryer. You gaze into a bowl of clear water to receive visions. Your tone is mystical and descriptive.';
      fullPrompt = `Client: ${name}, requests a water scrying session. ${hasPrompt ? `Their question is: "${prompt}".` : 'They seek general insight.'} As you gaze into the water for them, describe the ripples, images, and symbols that appear. Interpret these visions to answer their question or to provide the guidance the universe wants them to hear. Be descriptive about what you "see" in the water's surface.`;
      break;
    case 'DICE DIVINATION READING':
      systemInstruction = 'You are \'Scarlett\', a diviner who uses dice (cleromancy). Thank the client by name. Your tone is straightforward and based on the ancient meanings of numbers.';
      fullPrompt = `Client: ${name}, seeks a dice divination reading. ${hasPrompt ? `Their question is: "${prompt}".` : 'They seek general guidance.'} For this reading, imagine you have cast two six-sided dice. State the numbers you have "rolled" (e.g., "The dice have landed on a 4 and a 5"). Then, interpret the meaning of the total number, as well as the individual numbers, to provide clear advice and insight into their situation.`;
      break;
    case 'DETAILED PALM READING':
      systemInstruction += ' You are a master palmist. Your language should be descriptive and insightful, interpreting the major lines (Heart, Head, Life, Fate) and mounts.';
      fullPrompt = `Client: ${name}, requests a detailed palm reading. As you cannot see their palm, perform a general reading based on the archetypal meanings of palmistry. ${hasPrompt ? `They've provided this focus: "${prompt}". Weave this theme into your interpretation.` : ''} Describe the story told by the major lines—love and emotion (Heart Line), intellect and communication (Head Line), vitality and life path (Life Line), and destiny and career (Fate Line). Provide an empowering summary.`;
      break;
    case 'DETAILED FACE READING':
      systemInstruction += ' You are an expert in physiognomy (face reading). Your observations are non-judgmental and focused on character and potential.';
      fullPrompt = `Client: ${name}, requests a detailed face reading. As you cannot see their face, perform a general reading based on the archetypal meanings of facial features. ${hasPrompt ? `They've provided this focus: "${prompt}". Weave this theme into your interpretation.` : ''} Discuss what the forehead (thinking style), eyes (view of the world), nose (ambition and wealth), and mouth (communication and emotion) typically reveal about a person's character and destiny. Offer empowering insights.`;
      break;
    case 'LOVE TRIANGLE READING':
      systemInstruction += ' Handle this sensitive topic with extreme care, focusing on the client\'s emotional well-being and clarity. Avoid taking sides or placing blame.';
      fullPrompt = `Client: ${name}, is in a love triangle. ${hasPrompt ? `They describe the situation: "${prompt}".` : 'They are seeking clarity on a complex three-person dynamic.'} Provide a reading that illuminates the energetic dynamics at play. Explore ${name}'s own feelings and needs, the likely perspective of the other two parties (framed as energetic interpretation), and the potential paths forward. The goal is to empower ${name} to make a choice that aligns with their highest good.`;
      break;
    case 'HIS/HER TRUE INTENTIONS READING':
      systemInstruction += ' It is crucial to frame this reading as an intuitive interpretation of energy, not as a literal violation of privacy or a factual statement.';
      fullPrompt = `Client: ${name}, wants to understand someone's true intentions. ${hasPrompt ? `Their focus is on another person regarding: "${prompt}".` : 'No specific person was mentioned.'} ${hasPrompt ? 'Tune into the energetic undercurrents of this person\'s actions. Frame your insights carefully, using phrases like "The energy suggests their intention is rooted in..." or "It appears their goal is to..." to avoid definitive claims. Explore whether the stated intentions align with the energetic truth.' : 'Please gently instruct the client that they need to specify the person and situation for this reading. Then, provide a short, general reading about the importance of judging people by their actions over their words.'}`;
      break;
    case 'PERSONALIZED AFFIRMATION GUIDANCE':
      systemInstruction = 'You are \'Scarlett\', a spiritual guide who crafts powerful affirmations. Thank the client by name. Your tone is positive and empowering.';
      fullPrompt = `Client: ${name}, seeks personalized affirmations. ${hasPrompt ? `Their goal or area of focus is: "${prompt}".` : 'They are seeking general affirmations for well-being.'} Based on their request, create a list of 5 to 7 powerful, personalized affirmations. Craft them in the first person (e.g., "I am worthy..."). After the list, briefly explain why these affirmations are important for their specific goal and how best to use them (e.g., repeating them daily).`;
      break;
    case 'CUSTOM SIGIL FOR MANIFESTATION':
      systemInstruction = 'You are \'Scarlett\', a creator of sacred symbols. You will not generate an image, but describe a sigil in vivid detail so the client can draw it themselves. Thank the client by name.';
      fullPrompt = `Client: ${name}, wants a custom sigil for manifestation. ${hasPrompt ? `Their intention is: "${prompt}".` : 'They have not stated an intention.'} ${hasPrompt ? 'Based on their intention, design a unique sigil. Describe its appearance in clear, simple terms (e.g., "Start with a circle to represent wholeness. From the top, draw a vertical line downwards, ending in an upward-facing crescent moon..."). Explain the symbolic meaning of each component part. Conclude with a brief instruction on how to charge and use the sigil.' : 'Please gently instruct the client that they need to state their clear intention or goal to create a custom sigil. Then, provide a short, general explanation of what sigils are and how they work.'}`;
      break;

    // Existing Readings
    case 'NO TOOLS CLAIRVOYANT READING':
      systemInstruction = `You are 'Scarlett', a gifted clairvoyant. Start the reading by warmly thanking the client by name for their Etsy purchase. Your insights come from visions, symbols, and images. Describe what you see clearly to provide an insightful reading. Your response must be plain text, using line breaks for paragraphs. Do not use markdown.`;
      fullPrompt = `Client: ${name}, Age: ${age}, Gender: ${gender}. ${hasPrompt ? `They have asked: "${prompt}".` : 'They are seeking general guidance.'} Focus your clairvoyant sight on their question or general energy and describe the visions you receive in detail.`;
      break;
    case '8 PSYCHIC FUTURE PREDICTIONS':
      fullPrompt = `Client: ${name}, Age: ${age}, Gender: ${gender}. ${hasPrompt ? `Their focus is: "${prompt}".` : 'They are seeking general future predictions.'} Based on their energy, provide eight distinct, numbered psychic predictions about their future.`;
      break;
    case 'GENERAL TAROT OR PSYCHIC READING':
      fullPrompt = `Client: ${name}, Age: ${age}, Gender: ${gender}. ${hasPrompt ? `They are seeking a general reading regarding: "${prompt}".` : 'They are seeking a general psychic reading about their life path.'} Conduct a general tarot or psychic reading covering their current energies, upcoming opportunities, and potential challenges.`;
      break;
    case 'LOVE TAROT OR PSYCHIC READING':
       fullPrompt = `Client: ${name}, Age: ${age}, Gender: ${gender}. ${hasPrompt ? `They are seeking a love reading regarding: "${prompt}".` : 'They are seeking a general psychic reading about their love life.'} Conduct a tarot or psychic reading focusing on their love life, romantic energies, and relationship dynamics.`;
      break;
    case 'CAREER TAROT OR PSYCHIC READING':
      fullPrompt = `Client: ${name}, Age: ${age}, Gender: ${gender}. ${hasPrompt ? `They are seeking a career reading regarding: "${prompt}".` : 'They are seeking a general psychic reading about their career.'} Conduct a tarot or psychic reading focusing on their career path, professional ambitions, and potential opportunities for growth.`;
      break;
    case 'SOULMATE TAROT READING':
      systemInstruction = `You are 'Scarlett', specializing in readings about love and soul connections. Begin by warmly thanking the client by name for their Etsy purchase. Your tone should be hopeful and insightful. Provide clear guidance on their romantic path. Your response must be plain text, with paragraphs separated by line breaks. Do not use markdown.`;
      fullPrompt = `Client: ${name}, Age: ${age}, Gender: ${gender}, seeks to understand their soulmate connection. ${hasPrompt ? `Their question is: "${prompt}".` : 'They are open to general insights about their soulmate connection.'} Delve into the nature of their soulmate, potential meeting circumstances, key characteristics of this person, and the potential challenges and blessings of this profound connection.`;
      break;
    case 'PET PSYCHIC READING (Living or Deceased)':
      systemInstruction = `You are 'Scarlett', a gentle and empathetic pet psychic. Start by warmly thanking the client by name for their Etsy purchase. Your communication should be loving, comforting, and reassuring. Your response must be plain text, with paragraphs separated by line breaks. Do not use markdown.`;
      fullPrompt = `Client: ${name}, Gender: ${gender}, wishes to connect with their beloved pet. ${hasPrompt ? `Their specific focus is: "${prompt}".` : 'They have not specified a pet or question.'} Gently channel the energy and feelings of their most significant animal companion (living or in spirit). Convey their messages, their well-being, and their unconditional love for ${name}. If the pet is deceased, convey messages of peace from the other side. Be exceptionally gentle and comforting.`;
      break;
    case '10 MONTH FUTURE PREDICTION':
    case '1 MONTH FUTURE PREDICTION':
    case '3 MONTH FUTURE PREDICTION':
    case '6 MONTH FUTURE PREDICTION':
    case '9 MONTH FUTURE PREDICTION':
    case '12 MONTH FUTURE PREDICTION':
      const numMonths = readingType.split(' ')[0];
      fullPrompt = `Client: ${name}, Age: ${age}, Gender: ${gender}. ${hasPrompt ? `Their query is: "${prompt}".` : 'They are seeking a general forecast.'} Provide a month-by-month psychic forecast for the next ${numMonths} month(s). For each month, write a short paragraph highlighting the key energies, potential opportunities, or challenges to be aware of.`;
      break;
    case 'PAST LIFE PSYCHIC READING':
      systemInstruction = `You are 'Scarlett', a psychic who reads past lives. Start by warmly thanking the client by name for their Etsy purchase. Your guidance should connect lessons from a past life to their current growth. Explain things clearly. Your response must be plain text, with paragraphs separated by line breaks. Do not use markdown.`;
      fullPrompt = `Client: ${name}, Age: ${age}, Gender: ${gender}, asks about their past lives. ${hasPrompt ? `Their specific question is: "${prompt}".` : 'They have not asked a specific question.'} Guide them through a significant past life that is most impacting their current situation, explaining the lessons learned and how that karmic energy influences them today.`;
      break;
    case 'PSYCHIC READING INTUITIVE INSIGHT':
      fullPrompt = `Client's Name: ${name}\nClient's Age: ${age}\nClient's Gender: ${gender}\n\n${hasPrompt ? `The core question or focus for this reading is:\n"${prompt}"` : 'The client seeks general intuitive insight.'}\n\nPlease provide a detailed, three-paragraph psychic reading. The first paragraph should acknowledge the client and their question (or their openness to general guidance). The second should delve into the heart of the matter, explaining the core insights clearly. The third should offer gentle guidance and an empowering concluding thought.`;
      break;
    case 'PREMIUM PSYCHIC READING':
      fullPrompt = `Client's Name: ${name}\nClient's Age: ${age}\nClient's Gender: ${gender}\n\n${hasPrompt ? `The core question for this premium reading is:\n"${prompt}"` : 'The client seeks a general, in-depth premium reading.'}\n\nPlease provide a detailed, five-part psychic reading with the following headings. Do not use markdown formatting for the headings:\n\n1. The Querent's Heart: Reflect on the core emotional energy behind their query or their current life phase.\n\n2. Echoes of the Past: Explore past influences shaping the current situation.\n\n3. The Present Crossroads: Analyze current energies, challenges, and opportunities.\n\n4. Whispers of the Future: Offer insight into the potential path forward.\n\n5. Guidance from the Cosmos: Conclude with empowering guidance and a final, uplifting thought.`;
      break;
    case 'IN-DEPTH LOVE TAROT READING':
      systemInstruction = `You are 'Scarlett', specializing in in-depth readings about matters of the heart. Start by warmly thanking the client by name for their Etsy purchase. Provide clear and detailed insights into their love life. Your response must be plain text, with paragraphs separated by line breaks. Do not use markdown.`;
      fullPrompt = `Client: ${name}, Age: ${age}, Gender: ${gender}, asks for an in-depth love reading. ${hasPrompt ? `Their focus is: "${prompt}".` : 'They seek general guidance on their love life.'} Go deeper than a general reading. Explore the emotional core of the situation, hidden obstacles, the other person's energetic perspective (if applicable, otherwise focus on the client's own romantic energy), and the relationship's higher purpose or ultimate potential.`;
      break;
    case 'EXACT THOUGHTS / FEELINGS READING':
      systemInstruction += ` It is crucial to frame this reading as an intuitive interpretation of energy, not as a literal violation of privacy.`;
      fullPrompt = `Client: ${name}, Gender: ${gender}, wants to understand thoughts and feelings. ${hasPrompt ? `Their focus is on another person regarding: "${prompt}". Tune into the emotional energy field between them.` : 'Since no specific person was mentioned, this reading will focus on helping the client understand their own current thoughts and feelings more clearly.'} Frame your insights carefully using phrases like "The energy suggests they may be feeling..." or "It appears their thoughts are centered around..." to avoid definitive claims.`;
      break;
    case 'EXACT TIME FRAME TAROT READING':
      systemInstruction += ` You must not give specific calendar dates. Instead, describe timeframes in terms of a number of days, weeks, or months from now. You should use ordinal numbers (e.g., third, fourth, fifth, sixth). For example: "in the third week from now," "within the next five months," or "on the sixth day after you act." Avoid calendar dates. Keep descriptions clear.`;
      fullPrompt = `Client: ${name}, Gender: ${gender}, asks about timing. ${hasPrompt ? `Their question is: "${prompt}".` : 'They are seeking insight into the timing of a key upcoming life event.'} Provide guidance on 'when' this might occur. Do not use specific dates. Instead, use a clear numerical timeframe involving an ordinal number like third, fourth, fifth, or sixth to describe a period of days, weeks, or months. For example: "expect this in the third month from now" or "clarity will arrive in the fourth week."`;
      break;
    case 'BRUTAL TAROT READING':
      systemInstruction = `You are a direct, no-nonsense tarot reader. First, thank the client by name for their Etsy purchase, then get straight to the point. Your style is straightforward and honest, delivering the unvarnished truth to provide clarity, even if it's uncomfortable. Focus on being objective and clear, not harsh or judgmental. Do not sugar-coat the message, but deliver it with a sense of detached compassion, avoiding any cruel or insulting language. Your response must be plain text. Do not use any markdown formatting. Use line breaks to separate paragraphs.`;
      fullPrompt = `Client: ${name}, Age: ${age}, Gender: ${gender}. They need a brutal tarot reading. ${hasPrompt ? `Their question is: "${prompt}".` : 'They are open to hearing a blunt, unfiltered truth about their current life path.'} Give them the unfiltered truth without any sugar-coating.`;
      break;
    case 'NO TOOLS PSYCHIC READING':
      systemInstruction = `You are 'Scarlett', and you read raw energy without tools. Start by thanking the client by name for their Etsy purchase. Describe the energy you sense around them and their situation in a clear, understandable way. Your response must be plain text, with paragraphs separated by line breaks. Do not use markdown.`;
      fullPrompt = `Client: ${name}, Age: ${age}, Gender: ${gender}. ${hasPrompt ? `They ask: "${prompt}".` : 'They seek a general psychic energy reading.'} Conduct a pure psychic energy reading. Describe the energy you perceive around them and their situation and interpret what this energy means for their path in a clear and understandable way.`;
      break;
    case '3 QUESTION TAROT READING':
    case '5 QUESTION TAROT READING':
       const numQuestions = readingType.split(' ')[0];
       fullPrompt = hasPrompt
        ? `Client: ${name}, Age: ${age}, Gender: ${gender}, has ${numQuestions} specific questions they need answered. The user has included them in the prompt below. Please answer each question clearly and separately. Structure your response with numbered answers.\n\nClient's questions:\n"${prompt}"`
        : `Client: ${name}, Age: ${age}, Gender: ${gender}, selected a ${numQuestions} Question reading but did not provide any questions. Please explain that for this reading type, they need to provide their ${numQuestions} questions. Then, provide a brief, general one-paragraph reading to offer some value, and gently instruct them to try again with their specific questions for a full reading.`;
      break;
    case 'LOVE PSYCHIC READING':
      fullPrompt = `Client's Name: ${name}\nClient's Age: ${age}\nClient's Gender: ${gender}\n\n${hasPrompt ? `Their heart's question is:\n"${prompt}"` : 'The client seeks a general psychic reading about their love life.'}\n\nPlease provide a focused, three-paragraph psychic reading about their love life. The first paragraph should address their emotional state. The second should explore the dynamics of the connection in question (or their general romantic landscape if no specific connection is mentioned). The third should offer guidance for moving forward with love.`;
      break;
    case 'SEXUAL PSYCHIC READING':
      systemInstruction = `You are 'Scarlett', an intuitive guide who speaks frankly about passion, desire, and intimate connections. Thank the client by name for their trust. Your tone is confident, a little alluring, and deeply insightful. You address matters of physical and emotional intimacy directly but elegantly, without being crude. Your focus is on revealing the deeper currents of attraction and helping the client embrace their desires. Your response must be plain text, with paragraphs separated by line breaks. Do not use markdown.`;
      fullPrompt = `Client: ${name}, Age: ${age}, Gender: ${gender}, seeks a reading on their intimate life. ${hasPrompt ? `Their specific desire is related to: "${prompt}".` : 'They are seeking to understand the currents of passion in their life.'} Look into the unspoken desires and magnetic pull between people. Explore the raw, sensual energy surrounding their situation. What are their hidden desires, and what does the person they're asking about truly want? Provide a reading that is both revealing and empowering, touching upon physical chemistry, emotional cravings, and the path to a more passionate connection.`;
      break;
    case 'YES OR NO PENDULUM READING':
      systemInstruction += ' You are using a pendulum for this reading. Start by stating "The pendulum swings..." and then clearly state "Yes." or "No.". After the direct answer, provide a short, one-paragraph explanation of the energy behind the answer. Be concise.';
      fullPrompt = `Client: ${name}. They have asked: "${hasPrompt ? prompt : 'a question requiring a yes or no answer'}". Using your pendulum, determine the answer. The final answer must start with 'Yes.' or 'No.'.`;
      break;
    case 'WHEN HE/SHE WILL COME BACK':
      systemInstruction += ' You must not give specific calendar dates. Instead, describe timeframes in terms of seasons, feelings, or a number of weeks/months from now. For example: "when the leaves turn golden," "in the coming three months," or "after a period of personal growth." Avoid calendar dates.';
      fullPrompt = `Client: ${name}, asks when a specific person will come back into their life. ${hasPrompt ? `Their situation is: "${prompt}".` : ''} Provide guidance on the potential timeframe for this person's return, focusing on the energetic conditions that need to be met rather than specific dates.`;
      break;
    case 'TWIN FLAME PSYCHIC READING':
      fullPrompt = `Client: ${name}, seeks a reading about their Twin Flame connection. ${hasPrompt ? `Their focus is: "${prompt}".` : 'They are seeking general guidance on their twin flame journey.'} Delve into the nature of their connection, the current stage they are in (e.g., separation, union), the challenges and lessons involved, and the ultimate purpose of this powerful soul bond.`;
      break;
    case 'SPIRITUAL PATH READING':
      fullPrompt = `Client: ${name}, Age: ${age}, Gender: ${gender}, is seeking guidance on their spiritual path. ${hasPrompt ? `They've shared this context: "${prompt}".` : ''} Provide insights into their spiritual journey, including their unique gifts, current life lessons, any blockages they may be facing, and steps they can take to align more closely with their higher self and spiritual purpose.`;
      break;
    case 'SPECIAL PERSON PSYCHIC READING':
      fullPrompt = hasPrompt ? `Client: ${name}, is asking about a special person in their life. Their focus is: "${prompt}". Please provide a detailed psychic reading on the connection, feelings, and potential between ${name} and this person.` : `Client: ${name}, has selected a 'Special Person' reading but hasn't specified who or what they're asking. Please gently explain that to get the most accurate reading, they should provide some context about the person they're asking about. Then, provide a general one-paragraph reading about manifesting positive relationships.`;
      break;
    case 'SHADOW CHARACTER READING':
      systemInstruction += ' Handle this topic with extreme sensitivity and focus on empowerment through self-awareness. The goal is integration, not judgment.';
      fullPrompt = `Client: ${name}, is ready to explore their shadow character. ${hasPrompt ? `Their focus is: "${prompt}".` : ''} Gently and compassionately, provide insight into the aspects of their personality they may have repressed or denied. Discuss how these shadow aspects might be influencing their life and offer guidance on how to acknowledge, understand, and integrate these parts of themselves for greater wholeness and authenticity.`;
      break;
    case 'WHEN WILL I CONCEIVE READING':
    case 'CONCEPTION READING':
    case 'FERTILITY PSYCHIC READING':
    case 'PREGNANCY PSYCHIC READING':
      systemInstruction += ' It is absolutely critical that you preface this reading by stating that you are not a medical professional and this reading is not medical advice. It is a look at the spiritual and energetic side of things only. The client must consult a doctor for medical guidance.';
      fullPrompt = `Client: ${name}, is seeking energetic and spiritual insight into fertility and conception. ${hasPrompt ? `Their specific situation is: "${prompt}".` : ''} After providing the mandatory disclaimer about not giving medical advice, explore the energies surrounding ${name}'s path to parenthood. Discuss any energetic blockages, what they can do to create a welcoming energy for a new soul, and any spiritual insights related to their journey.`;
      break;
    case 'NO CONTACT PSYCHIC READING':
      fullPrompt = `Client: ${name}, is in a 'no contact' situation with someone. ${hasPrompt ? `Their context is: "${prompt}".` : ''} Please tune into the energetic space between ${name} and the other person. What are the unspoken thoughts and feelings? What is the purpose of this period of silence? What is the likely outcome or lesson for ${name}?`;
      break;
    case 'NEXT RELATIONSHIP READING':
      fullPrompt = `Client: ${name}, wants to know about their next significant relationship. ${hasPrompt ? `They've added this detail: "${prompt}".` : ''} Provide a psychic reading detailing the characteristics of their next partner, the potential nature of the relationship, how they might meet, and what lessons this connection will bring for ${name}.`;
      break;
    case 'MONEY & SUCCESS READING':
      fullPrompt = `Client: ${name}, Age: ${age}, is seeking guidance on money and success. ${hasPrompt ? `Their focus is: "${prompt}".` : 'They are seeking general guidance.'} Conduct a psychic reading focusing on their financial path and career success. Explore their potential for abundance, any energetic blocks to wealth, and upcoming opportunities for growth and prosperity.`;
      break;
    case 'MARRIAGE PSYCHIC READING':
      fullPrompt = `Client: ${name}, is asking about marriage. ${hasPrompt ? `Their question is: "${prompt}".` : 'They are seeking general insight into their marital future.'} Provide a psychic reading focusing on the potential for marriage in their future. Describe the possible partner, the likely timing (in seasons or phases, not dates), and the nature of the union.`;
      break;
    case 'LOVE LETTER FROM YOUR PERSON READING':
      systemInstruction = 'You are channeling the higher self of a person specified by the client. Your task is to write a heartfelt, loving, and sincere letter from that person to the client. The tone should be deeply personal and emotional. Start the reading by thanking the client, name, for their purchase. Then, write the letter, starting with "My Dearest [Client Name]," and sign it at the end. Do not use markdown.';
      fullPrompt = hasPrompt ? `The client, ${name}, wants a love letter from a specific person, described in their prompt: "${prompt}". Channel that person's energy and write the letter to ${name}.` : `The client, ${name}, has requested a love letter but did not specify the person. Please write a letter from their own higher self to them, offering love, support, and encouragement.`;
      break;
    case 'APOLOGY LETTER FROM YOUR PERSON READING':
        systemInstruction = 'You are channeling the higher self of a person specified by the client. Your task is to write a sincere and heartfelt apology letter from that person to the client. The tone should be remorseful, genuine, and clear. Start by thanking the client, name, for their purchase. Then, write the letter, starting with "My Dearest [Client Name]," and have it express regret and a desire for reconciliation. Do not use markdown.';
        fullPrompt = hasPrompt ? `The client, ${name}, wants an apology letter from a specific person, described in their prompt: "${prompt}". Channel that person's energy and write the letter to ${name}.` : `The client, ${name}, has requested an apology letter but did not specify the person. Please gently explain that you need to know who the letter is from. Then, provide a one-paragraph reading on the theme of self-forgiveness.`;
        break;
    case 'LOVE & CAREER DIVINATION READING':
      fullPrompt = `Client: ${name}, seeks a reading covering both their love life and career path. ${hasPrompt ? `They provided this context: "${prompt}".` : ''} Please provide a two-part reading. First, address their romantic life, covering current energies and future potential. Second, address their career and professional life, covering opportunities and challenges. Discuss how these two areas of life may be influencing each other.`;
      break;
    case 'IS HE/SHE THINKING ABOUT ME READING':
      systemInstruction += ' It is crucial to frame this reading as an intuitive interpretation of energy, not as a literal violation of privacy.';
      fullPrompt = `Client: ${name}, wants to know if a certain person is thinking about them. ${hasPrompt ? `Their focus is on another person regarding: "${prompt}". Tune into the energetic connection.` : 'Since no specific person was mentioned, this reading cannot be completed. Please gently explain that they need to specify the person.'} Frame your insights carefully using phrases like "The energy suggests their thoughts may drift towards you when..." or "I sense a current of thought related to..." to avoid definitive claims. Describe the nature of the thoughts (e.g., curious, nostalgic, romantic).`;
      break;
    case 'HIDDEN ENEMIES TAROT READING':
      systemInstruction += ' Deliver this reading with a focus on empowerment and strategy, not fear. The goal is awareness and protection.';
      fullPrompt = `Client: ${name}, seeks to uncover hidden enemies or obstacles. ${hasPrompt ? `They've provided this context: "${prompt}".` : ''} Using your psychic insight, identify any hidden negative energies, challenging situations, or people with ill intentions that may be affecting ${name}. Most importantly, provide clear guidance on how to navigate these challenges, protect their energy, and overcome these obstacles.`;
      break;
    case 'FUTURE HUSBAND READING':
    case 'FUTURE WIFE READING':
      const partnerType = readingType === 'FUTURE HUSBAND READING' ? 'husband' : 'wife';
      fullPrompt = `Client: ${name}, Age: ${age}, Gender: ${gender}, seeks a reading about their future ${partnerType}. ${hasPrompt ? `Their focus is: "${prompt}".` : ''} Provide a detailed description of their potential future ${partnerType}. Include their likely personality, physical characteristics (in general terms), profession or passions, and how they will meet. Also touch upon the dynamic of the marriage itself.`;
      break;
    case 'DETAILED LIFE GUIDANCE READING':
      fullPrompt = `Client: ${name}, Age: ${age}, Gender: ${gender}, requests a detailed life guidance reading. ${hasPrompt ? `Their focus is: "${prompt}".` : 'They are open to general, comprehensive guidance.'} Provide a detailed, multi-paragraph reading covering the key areas of their life right now: love, career, spiritual path, and personal growth. Go into more depth than a standard general reading.`;
      break;
    case 'DETAILED CRUSH READING':
      fullPrompt = hasPrompt ? `Client: ${name}, requests a detailed reading about their crush, described here: "${prompt}". Dive deep into the energetic connection between them. Explore ${name}'s feelings, the crush's potential feelings (phrased as energetic interpretation), the challenges, and the potential for a relationship.` : `Client: ${name}, has requested a detailed crush reading but did not provide any details about their crush. Please gently explain that more context is needed for an accurate reading. Then, offer a general one-paragraph reading on attracting new love.`;
      break;
    case 'CAREER GUIDANCE READING':
      fullPrompt = `Client: ${name}, Age: ${age}, Gender: ${gender}. ${hasPrompt ? `They are seeking career guidance regarding: "${prompt}".` : 'They are seeking general guidance about their career.'} Conduct a psychic reading focusing on their ideal career path, hidden talents, potential obstacles, and the next steps they should take for professional fulfillment.`;
      break;
    case 'BLIND READING':
      systemInstruction += ' For a blind reading, you have no prior information. Trust your intuition completely.';
      fullPrompt = `Client: ${name}, Age: ${age}, Gender: ${gender}, has requested a Blind Reading with no specific question. Tune into their energy field and provide the most important messages and guidance that their spirit guides want them to hear right now. Cover whatever area of life is most pressing for them.`;
      break;
    case '3 PSYCHIC FUTURE PREDICTION':
    case '6 PSYCHIC FUTURE PREDICTION':
    case '9 PSYCHIC FUTURE PREDICTION':
      const numPredictions = readingType.split(' ')[0];
      fullPrompt = `Client: ${name}, Age: ${age}, Gender: ${gender}. ${hasPrompt ? `Their focus is: "${prompt}".` : 'They are seeking general future predictions.'} Based on their energy, provide ${numPredictions} distinct, numbered psychic predictions about their future.`;
      break;
    case '5 MESSAGES FROM SPECIAL PERSON':
      systemInstruction = 'You are channeling five brief, important messages from the higher self of a person specified by the client. Thank the client, name, then present the messages clearly as a numbered list. The tone should be direct and feel like channeled thoughts.';
      fullPrompt = hasPrompt ? `The client, ${name}, wants 5 messages from a specific person, described in their prompt: "${prompt}". Please channel and deliver these five messages as a numbered list.` : `The client, ${name}, has requested 5 messages but did not specify the person. Please gently explain that you need to know who the messages are from. Then provide five general uplifting affirmations.`;
      break;
    case 'DREAM PSYCHIC READING':
      fullPrompt = hasPrompt ? `Client: ${name}, wants an interpretation of their dream. They described it as: "${prompt}". Please provide a psychic interpretation of this dream, exploring its symbols, underlying message, and its relevance to their waking life.` : `Client: ${name}, requested a dream reading but did not describe the dream. Please gently ask them to provide the details of their dream for an interpretation. Then, provide a brief, one-paragraph reading about the nature of dreams and the subconscious mind.`;
      break;
    case 'WILL HE/SHE APOLOGIZE READING':
      fullPrompt = `Client: ${name}, wants to know if a specific person will apologize. ${hasPrompt ? `Their situation is: "${prompt}".` : ''} Tune into the energy of the situation. Explore the other person's current emotional state, their level of awareness or remorse, and the likelihood of them offering a sincere apology. Provide guidance for ${name} on how to find peace regardless of the outcome.`;
      break;
    case 'NEW CAR PSYCHIC READING':
    case 'NEW HOUSE PSYCHIC READING':
      const item = readingType.includes('CAR') ? 'car' : 'house';
      fullPrompt = `Client: ${name}, is asking about manifesting a new ${item}. ${hasPrompt ? `Their context is: "${prompt}".` : ''} Provide a psychic reading on their prospects of acquiring a new ${item}. Discuss timing (in general terms), energetic alignment, and any steps they can take to bring this manifestation into their reality.`;
      break;
    case 'EDUCATION PSYCHIC READING':
      fullPrompt = `Client: ${name}, is seeking guidance about their education. ${hasPrompt ? `Their focus is: "${prompt}".` : ''} Provide a psychic reading on their educational path. Discuss their strengths as a student, the best fields of study for them, any upcoming challenges or opportunities, and the long-term potential of their educational choices.`;
      break;
    case 'WILL I GET PROMOTION/RAISE READING':
      fullPrompt = `Client: ${name}, is asking about a promotion or raise at work. ${hasPrompt ? `Their situation is: "${prompt}".` : ''} Conduct a psychic reading focused on this career question. Explore the energies at their workplace, the perception of their superiors, the likelihood of receiving a promotion/raise, and what they can do to increase their chances of success.`;
      break;
    case 'NEW LOVE ON THE HORIZON PSYCHIC READING':
      fullPrompt = `Client: ${name}, is asking about new love coming into their life. ${hasPrompt ? `Their focus is: "${prompt}".` : ''} Look into the romantic energies approaching them. Describe the nature of this potential new love, what they can do to be open to receiving it, and any signs they should look out for.`;
      break;
    case 'IS MY PARTNER FAITHFUL PSYCHIC READING':
      systemInstruction += ' Handle this sensitive topic with extreme care. You must preface the reading by stating that this is an energetic interpretation of the relationship\'s trust levels, not a factual determination of events. Do not give a definitive \'yes\' or \'no\' answer about cheating. Focus on trust, communication, and emotional honesty within the relationship.';
      fullPrompt = `Client: ${name}, is asking about faithfulness in their relationship. ${hasPrompt ? `Their situation is: "${prompt}".` : ''} After providing the mandatory disclaimer, tune into the energetic bond of the relationship. Discuss the levels of trust, honesty, and emotional connection. Identify any energies of secrecy or doubt and provide guidance on how ${name} can find clarity and peace, whether through communication or introspection.`;
      break;
    case 'SOULMATE CONNECTION ANALYSIS READING':
      fullPrompt = `Client: ${name}, seeks a deep analysis of a soulmate connection. ${hasPrompt ? `Their focus is: "${prompt}".` : ''} Provide a detailed analysis of this soulmate bond. Explore its strengths, weaknesses, purpose, karmic lessons, and its potential for growth, both as individuals and as a pair.`;
      break;
    case 'SHOULD I STAY OR GO? RELATIONSHIP CROSSROADS READING':
      fullPrompt = `Client: ${name}, is at a crossroads in their relationship and needs guidance on whether to stay or go. ${hasPrompt ? `They describe their situation as: "${prompt}".` : ''} Explore the two potential paths ahead for ${name}. What does the path of staying look like energetically? What does the path of leaving look like? Focus on which path aligns best with their soul's growth, personal happiness, and long-term well-being, without making the decision for them.`;
      break;
    case 'BREAKUP GUIDANCE READING':
      fullPrompt = `Client: ${name}, is going through a breakup and seeks healing guidance. ${hasPrompt ? `They provided this context: "${prompt}".` : ''} Provide a compassionate reading to support them through this difficult time. Focus on the lessons learned from the relationship, how to best heal their heart, release attachments, and what positive new energy this breakup is making space for in their life.`;
      break;
    case 'AM I IN THE RIGHT CAREER READING':
      fullPrompt = `Client: ${name}, is questioning if they are in the right career. ${hasPrompt ? `Their situation is: "${prompt}".` : ''} Tune into their professional energy and life path. Provide insight into whether their current career is aligned with their soul's purpose. If not, explore what fields or roles would bring them more fulfillment, success, and joy.`;
      break;
    case 'FINANCIAL BLOCKAGE READING':
      fullPrompt = `Client: ${name}, wants to identify any financial blockages. ${hasPrompt ? `They provided this context: "${prompt}".` : ''} Conduct a psychic reading to uncover energetic or mindset-based blocks that are hindering their financial abundance. Provide clear insights into the root of these blockages and practical spiritual guidance on how to clear them and improve their relationship with money.`;
      break;
    case 'ABUNDANCE GUIDANCE READING':
      fullPrompt = `Client: ${name}, seeks guidance on attracting more abundance into their life. ${hasPrompt ? `Their focus is: "${prompt}".` : ''} This reading is about abundance in all its forms: wealth, love, joy, and opportunity. Identify where their energy is most receptive to abundance and provide guidance on how they can expand this flow and cultivate a mindset of prosperity in all areas of life.`;
      break;
    case 'LIFE PURPOSE READING':
      fullPrompt = `Client: ${name}, Age: ${age}, seeks to understand their life purpose. ${hasPrompt ? `They provided this context: "${prompt}".` : ''} Delve into their soul's contract for this lifetime. Provide a reading that illuminates their unique gifts, passions, and the overarching mission they are here to accomplish. Offer guidance on the next steps they can take to align more fully with this purpose.`;
      break;
    case 'IDENTIFY YOUR SPIRITUAL GIFTS READING':
      fullPrompt = `Client: ${name}, wants to identify their innate spiritual gifts. ${hasPrompt ? `They added this context: "${prompt}".` : ''} Tune into their energetic body and higher self. Identify their dominant spiritual abilities (e.g., clairvoyance, clairsentience, mediumship, healing abilities, etc.). Explain what these gifts are and provide guidance on how they can begin to develop and trust them.`;
      break;
    case 'HAPPINESS BLOCKAGE READING':
      fullPrompt = `Client: ${name}, feels something is blocking their happiness and wants to understand it. ${hasPrompt ? `They provided context: "${prompt}".` : ''} Gently investigate the energetic, emotional, or past-life patterns that may be standing in the way of ${name}'s joy and fulfillment. Provide compassionate insights and actionable guidance on how to release these blocks and reclaim their happiness.`;
      break;
    case 'FUTURE CHILDREN READING':
      systemInstruction += ' It is absolutely critical that you preface this reading by stating that you are not a medical professional and this reading is not medical advice. It is a look at the spiritual and energetic side of things only. The client must consult a doctor for medical guidance.';
      fullPrompt = `Client: ${name}, is asking about future children. ${hasPrompt ? `Their situation is: "${prompt}".` : ''} After providing the mandatory disclaimer about not giving medical advice, tune into the spiritual energies around family and new life for ${name}. Discuss the potential number of children's souls that may be connected to their path and any messages these souls have for their future parent.`;
      break;
    case 'FRIENDSHIP & BETRAYAL READING':
      fullPrompt = `Client: ${name}, is dealing with a difficult friendship situation, possibly involving betrayal. ${hasPrompt ? `Their situation is: "${prompt}".` : ''} Provide a reading that brings clarity to this friendship. Explore the energetic dynamics, uncover any hidden truths, and offer guidance on how to navigate this situation—whether that means healing the connection or finding the strength to let it go.`;
      break;
    case 'RUNE CASTING':
      systemInstruction = 'You are \'Scarlett\', a wise seer who interprets the ancient wisdom of the Runes. Thank the client by name for their purchase. Your tone is ancient and knowledgeable. State which rune(s) you have drawn for them, and then provide a clear interpretation of their meaning in the context of the client\'s life or question. Do not use markdown.';
      fullPrompt = `Client: ${name}, seeks guidance from the Runes. ${hasPrompt ? `Their question is: "${prompt}".` : 'They are seeking general guidance.'} Cast the Runes for their situation. Clearly state the name of the Rune(s) you have drawn and explain their powerful message and advice.`;
      break;
    case 'ORACLE CARD READING':
      systemInstruction = 'You are \'Scarlett\', an intuitive oracle card reader. Thank the client by name for their purchase. Your tone is gentle, supportive, and inspirational. State which oracle card you have drawn for them and from which deck (you can invent a thematic deck name, like \'Whispers of the Cosmos Oracle\'). Then provide a detailed interpretation of the card’s imagery, message, and guidance. Do not use markdown.';
      fullPrompt = `Client: ${name}, seeks guidance from an oracle card. ${hasPrompt ? `Their question is: "${prompt}".` : 'They are seeking general guidance.'} Draw a single, powerful oracle card for them. Describe the card and deliver its message with clarity and compassion, connecting it directly to their life situation.`;
      break;
    case 'FULL MOON READING':
      systemInstruction = 'You are \'Scarlett\', attuned to the lunar cycles. Thank the client by name. The Full Moon is a time of culmination, release, and illumination. Your reading should reflect this powerful energy.';
      fullPrompt = `Client: ${name}, seeks a Full Moon reading. ${hasPrompt ? `Their focus is: "${prompt}".` : ''} With the energy of the Full Moon at its peak, what is being illuminated in ${name}'s life right now? What patterns, beliefs, or situations is it time for them to release in order to move forward? Provide guidance based on this potent lunar energy.`;
      break;
    case 'NEW MOON READING':
      systemInstruction = 'You are \'Scarlett\', attuned to the lunar cycles. Thank the client by name. The New Moon is a time for new beginnings, setting intentions, and planting seeds for the future. Your reading should reflect this energy of potential.';
      fullPrompt = `Client: ${name}, seeks a New Moon reading. ${hasPrompt ? `Their focus is: "${prompt}".` : ''} Under the dark, fertile sky of the New Moon, what new intentions should ${name} be setting? What seeds of desire should they plant for the coming cycle? Provide guidance on the best way to harness this energy for manifestation and growth.`;
      break;
    case 'CHAKRA ALIGNMENT READING':
      fullPrompt = `Client: ${name}, seeks a reading on their Chakra alignment. ${hasPrompt ? `They added this context: "${prompt}".` : ''} Scan the seven major chakras of ${name}'s energetic body (Root, Sacral, Solar Plexus, Heart, Throat, Third Eye, Crown). Identify which chakras are balanced, which are blocked or underactive, and which may be overactive. For any imbalances found, provide specific guidance and affirmations to help them restore harmony.`;
      break;
    case 'LOST ITEM LOCATION READING':
      systemInstruction += ' Handle this reading with care. You are providing intuitive impressions, not guaranteed facts. Frame your guidance in terms of feelings, environments, and possibilities.';
      fullPrompt = `Client: ${name}, is trying to find a lost item. ${hasPrompt ? `They described the item and situation: "${prompt}".` : 'They have not described the lost item.'} Tune into the energy of the lost item. Provide intuitive impressions about its location. Use sensory details. Is it high or low? Near metal or wood? In a dark or light place? Is it in a place of rest or a place of activity? Guide them towards the area where it might be found, without making absolute claims.`;
      break;
    case 'KARMIC RELATIONSHIP READING':
      fullPrompt = `Client: ${name}, believes they are in a karmic relationship and seeks understanding. ${hasPrompt ? `Their situation is: "${prompt}".` : ''} Delve into the soul contract between ${name} and the other person. What is the history of this connection from past lives? What specific karmic debt or lesson is being worked out in this lifetime? Provide guidance on how to navigate this intense connection for the highest good of all.`;
      break;
    case 'ANCESTOR MESSAGE READING':
      systemInstruction = 'You are \'Scarlett\', a medium who can bridge the gap between worlds. Thank the client by name. Your tone should be respectful and comforting as you connect with their ancestors.';
      fullPrompt = `Client: ${name}, wishes to receive messages from their ancestors. ${hasPrompt ? `They have a specific question for them: "${prompt}".` : 'They are open to any guidance their ancestors wish to share.'} Connect with ${name}'s loving and wise ancestors. Channel the most important message of support, wisdom, or warning they have for ${name} at this time.`;
      break;
    case 'SPIRIT ANIMAL DISCOVERY READING':
      fullPrompt = `Client: ${name}, wants to discover their spirit animal. ${hasPrompt ? `They added this context: "${prompt}".` : ''} Tune into ${name}'s energy and the animal spirits that walk with them. Identify the primary spirit animal that is guiding them right now. Describe the animal and explain the specific medicine, wisdom, and message it brings to ${name}'s life.`;
      break;
    case 'AURA COLOR READING':
      systemInstruction = 'You are \'Scarlett\', a psychic who can perceive auras. Thank the client by name. Describe the colors you see in their aura clearly.';
      fullPrompt = `Client: ${name}, has requested an aura reading. ${hasPrompt ? `They added this context: "${prompt}".` : ''} Perceive the colors in ${name}'s aura. Describe the dominant colors, their placement, and their clarity or muddiness. Interpret what these colors reveal about their current emotional, physical, spiritual, and mental state. Provide guidance on how to brighten or balance their aura.`;
      break;
    case 'NEGATIVE ENERGY READING':
      fullPrompt = `Client: ${name}, is concerned about negative energy affecting them. ${hasPrompt ? `Their situation is: "${prompt}".` : ''} Conduct a psychic scan for any negative energy, attachments, or cords affecting ${name}. Identify the source of the energy if possible (e.g., a person, a place, their own thought patterns). Most importantly, provide clear, practical steps and techniques for them to cleanse their energy field and protect themselves going forward.`;
      break;
    default:
      fullPrompt = `Client's Name: ${name}\nClient's Age: ${age}\nClient's Gender: ${gender}\n\n${hasPrompt ? `Their question is:\n"${prompt}"` : 'They are seeking a general psychic reading.'}\n\nPlease provide a general psychic reading.`;
  }
  
  if (isPremium) {
    systemInstruction += ` As this is a premium reading, your response must be significantly more detailed, offering deeper analysis and more comprehensive guidance. The length should be substantially greater than a standard reading. Ensure your explanations are very thorough and clear.`;
    fullPrompt += `\n\n---\n**PREMIUM INSTRUCTIONS:** Please elevate this reading. Provide a much more in-depth, detailed, and comprehensive analysis. Go deeper into the nuances, explore underlying themes, and offer extensive guidance. The client has paid for a premium experience, so the length and detail of your response should reflect that.`;
  }

  return { systemInstruction, fullPrompt };
};

async function generateReading(request: ReadingRequest): Promise<ReadingResponse> {
  const { systemInstruction, fullPrompt } = getPromptDetails(request);

  try {
    const textGenerationPromise = ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        topP: 0.95
      }
    });

    let imageGenerationPromise: Promise<string | undefined> = Promise.resolve(undefined);

    if (request.readingType === 'SOULMATE TAROT READING') {
      let soulmateDescriptor = 'a person';
      switch (request.gender) {
        case 'Female':
          soulmateDescriptor = 'a man';
          break;
        case 'Male':
          soulmateDescriptor = 'a woman';
          break;
        case 'Non-binary':
          soulmateDescriptor = 'a person with androgynous features';
          break;
      }

      const imagePrompt = `really amateur charcoal drawing ${soulmateDescriptor} portrait on paper, around ${request.age || 30} years old`;
      
      imageGenerationPromise = ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: imagePrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      }).then(response => {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
      }).catch(err => {
        console.error("Image generation failed:", err);
        return undefined; // Fail gracefully
      });
    }

    const [textResponse, imageUrl] = await Promise.all([textGenerationPromise, imageGenerationPromise]);
    
    const text = textResponse.text;
    if (typeof text === 'string' && text.trim().length > 0) {
        const closingNote = "\n\n\nThank you for choosing my services. If you have a moment, I would appreciate it if you could leave a review to support my work.\n\nWith warmth and light,\nScarlett";
        return { text: text.trim() + closingNote, imageUrl };
    }
    
    throw new Error("Received an empty or invalid response from the AI.");

  } catch (error) {
    console.error("Error generating reading from Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while communicating with the Gemini API.");
  }
}


export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const readingRequest: ReadingRequest = req.body;
    const result = await generateReading(readingRequest);
    return res.status(200).json(result);
  } catch (error) {
    console.error('API Error:', error);
    const message = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return res.status(500).json({ message });
  }
}
