// import OpenAI from "openai";

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// });

// export async function generateFortSuggestion() {
//   const prompt = `
// Generate a suggestion for a historical fort in Maharashtra, India.

// Return STRICT JSON with this structure:
// {
//   "name": "",
//   "description": "",
//   "location": "",
//   "hints": ["", "", ""]
// }

// Rules:
// - Description: 2–3 sentences
// - Hints: progressively helpful
// - Do NOT include markdown
// - Do NOT include explanations
// `;

//   const completion = await client.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [{ role: "user", content: prompt }],
//     temperature: 0.7,
//   });

//   const text = completion.choices[0].message.content!;
//   return JSON.parse(text);
// }

// Mock AI provider for Fort Suggestions
// Used to avoid external billing dependencies during assignment evaluation

type FortSuggestion = {
  name: string;
  description: string;
  location: string;
  hints: string[];
};

const FORT_SUGGESTIONS: FortSuggestion[] = [
  {
    name: "Raigad Fort",
    description:
      "Raigad Fort served as the capital of the Maratha Empire under Chhatrapati Shivaji Maharaj and was strategically built atop a hill in the Sahyadri range.",
    location: "Raigad district, Maharashtra",
    hints: [
      "It was the capital of the Maratha Empire",
      "Associated with Chhatrapati Shivaji Maharaj",
      "Accessible today via a ropeway",
    ],
  },
  {
    name: "Sinhagad Fort",
    description:
      "Sinhagad Fort is a historic fort near Pune, known for the Battle of Sinhagad and its strategic importance in Maratha history.",
    location: "Near Pune, Maharashtra",
    hints: [
      "Previously known as Kondhana",
      "Site of a famous Maratha battle",
      "Located close to Pune city",
    ],
  },
  {
    name: "Pratapgad Fort",
    description:
      "Pratapgad Fort is famous for the historic battle between Chhatrapati Shivaji Maharaj and Afzal Khan and stands as a symbol of Maratha valor.",
    location: "Satara district, Maharashtra",
    hints: [
      "Linked to a famous historic duel",
      "Built by Chhatrapati Shivaji Maharaj",
      "Located near Mahabaleshwar",
    ],
  },
  {
    name: "Rajgad Fort",
    description:
      "Rajgad Fort was the first capital of the Maratha Empire and played a crucial role in the early administration of Shivaji Maharaj.",
    location: "Pune district, Maharashtra",
    hints: [
      "First capital of the Maratha Empire",
      "One of the largest forts in Maharashtra",
      "Located near Pune",
    ],
  },
  {
    name: "Torna Fort",
    description:
      "Torna Fort is one of the highest hill forts in Maharashtra and was the first fort captured by Chhatrapati Shivaji Maharaj.",
    location: "Pune district, Maharashtra",
    hints: [
      "First fort captured by Shivaji Maharaj",
      "One of the highest forts in Maharashtra",
      "Also known as Prachandagad",
    ],
  },
  {
    name: "Shivneri Fort",
    description:
      "Shivneri Fort is the birthplace of Chhatrapati Shivaji Maharaj and is a well-preserved fort with historical significance.",
    location: "Junnar, Pune district",
    hints: [
      "Birthplace of Chhatrapati Shivaji Maharaj",
      "Well-fortified hill fort",
      "Located near Junnar",
    ],
  },
  {
    name: "Daulatabad Fort",
    description:
      "Daulatabad Fort is an impregnable fortress known for its advanced defense mechanisms and strategic design.",
    location: "Aurangabad district, Maharashtra",
    hints: [
      "Known for complex defense systems",
      "Previously called Devagiri",
      "Located near Aurangabad",
    ],
  },
  {
    name: "Lohagad Fort",
    description:
      "Lohagad Fort is a popular trekking destination and played an important role in Maratha military history.",
    location: "Lonavala, Maharashtra",
    hints: [
      "Popular trekking fort",
      "Close to Lonavala",
      "Connected to Visapur Fort",
    ],
  },
  {
    name: "Visapur Fort",
    description:
      "Visapur Fort is a large hill fort near Lohagad, known for its scenic beauty and historical importance.",
    location: "Lonavala, Maharashtra",
    hints: [
      "Larger twin of Lohagad",
      "Built during Peshwa rule",
      "Popular during monsoons",
    ],
  },
  {
    name: "Panhala Fort",
    description:
      "Panhala Fort is one of the largest forts in Maharashtra and was a significant stronghold during the Maratha period.",
    location: "Kolhapur district, Maharashtra",
    hints: [
      "One of the largest forts",
      "Associated with Shivaji Maharaj",
      "Located near Kolhapur",
    ],
  },
  {
    name: "Murud-Janjira Fort",
    description:
      "Murud-Janjira Fort is a sea fort known for remaining unconquered and built by the Siddis off the Konkan coast.",
    location: "Raigad district, Maharashtra",
    hints: [
      "Unconquered sea fort",
      "Built by the Siddis",
      "Located off the Konkan coast",
    ],
  },
  {
    name: "Sindhudurg Fort",
    description:
      "Sindhudurg Fort is a sea fort constructed by Chhatrapati Shivaji Maharaj to protect the Konkan coastline.",
    location: "Malvan, Maharashtra",
    hints: [
      "Sea fort built by Shivaji Maharaj",
      "Located near Malvan",
      "Surrounded by the Arabian Sea",
    ],
  },
  {
    name: "Vijaydurg Fort",
    description:
      "Vijaydurg Fort was a major naval base of the Maratha Empire and played a vital role in maritime defense.",
    location: "Sindhudurg district, Maharashtra",
    hints: [
      "Important Maratha naval base",
      "Located on the Konkan coast",
      "Associated with naval power",
    ],
  },
  {
    name: "Harishchandragad",
    description:
      "Harishchandragad is an ancient hill fort known for its rugged terrain and breathtaking natural views.",
    location: "Ahmednagar district, Maharashtra",
    hints: [
      "Ancient hill fort",
      "Famous for trekking",
      "Known for Konkan Kada cliff",
    ],
  },
  {
    name: "Purandar Fort",
    description:
      "Purandar Fort played a key role in Maratha history and was the site of the Treaty of Purandar.",
    location: "Pune district, Maharashtra",
    hints: [
      "Site of Treaty of Purandar",
      "Near Pune",
      "Twin fort with Vajragad",
    ],
  },
  {
    name: "Salher Fort",
    description:
      "Salher Fort is the highest fort in Maharashtra and was the site of a historic battle between the Marathas and Mughals.",
    location: "Nashik district, Maharashtra",
    hints: [
      "Highest fort in Maharashtra",
      "Site of a major battle",
      "Located near Nashik",
    ],
  },
  {
    name: "Ajinkyatara Fort",
    description:
      "Ajinkyatara Fort overlooks the city of Satara and was an important Maratha stronghold.",
    location: "Satara, Maharashtra",
    hints: [
      "Overlooks Satara city",
      "Important Maratha fort",
      "Hilltop fort",
    ],
  },
  {
    name: "Suvarnadurg Fort",
    description:
      "Suvarnadurg Fort is a sea fort that served as an important naval base for the Maratha Empire.",
    location: "Ratnagiri district, Maharashtra",
    hints: [
      "Sea fort",
      "Maratha naval base",
      "Located near Harnai",
    ],
  },
  {
    name: "Tikona Fort",
    description:
      "Tikona Fort is a triangular-shaped hill fort offering panoramic views of the Pawna region.",
    location: "Pawna Lake region, Maharashtra",
    hints: [
      "Triangular-shaped fort",
      "Near Pawna Lake",
      "Popular trekking destination",
    ],
  },
  {
    name: "Korigad Fort",
    description:
      "Korigad Fort is a well-preserved hill fort near Lonavala known for its easy trek and scenic surroundings.",
    location: "Lonavala, Maharashtra",
    hints: [
      "Easy trekking fort",
      "Near Lonavala",
      "Well-preserved structures",
    ],
  },
];

export async function generateFortSuggestion(): Promise<FortSuggestion> {
  return FORT_SUGGESTIONS[
    Math.floor(Math.random() * FORT_SUGGESTIONS.length)
  ];
}
