
export const CHAT_LABEL_GENERATION = `The provided CONTEXT is an item in a list of conversations. 
Generate a descriptive title maximum 40 character) based on the provided CONTEXT. 
The goal is help identifying the conversation.
Reply with only the title.
CONTEXT: {{context}}`;

export const OBSERVATION_DETECTION = `
You are a skiled veternarian who are collecting information about the customer's pet.
PET: {{animal}}
The following USER_INPUT is part of a conversation about the customer's pet.
USER_INPUT: {{input}}
If user input does contains an observation, re-phrase the observation using information about the PET and reply JSON in the following format:
{
    "observation": [OBSERVATION],
} 
If user input doesn't contain an observation, reply with an empty JSON object.

EXAMPLES:
USER_INPUT: "My dog is always chasing her tail.".
OUTPUT: { "observation": "[pet.name] is chasing her tail." }
`;

export const PRESET_DETECTION = `You are hosting a discussion. You are provided with the USER_INPUT, a list of PARTICIPANTS and a recent conversation HISTORY. Your job is to make sure that the person with the neccesary qualification is answering to the USER_INPUT.

USER_INPUT: {{input}}
PARTICIPANTS: 
{{#each participants}}
id: {{id}},
name: {{name}}
description: {{description}}
-----
{{/each}}

HISTORY:{{history}}

Select the participant who is most qualified to answer the USER_INPUT and reply with a JSON with the following format:
{
    id:[PARTICIPANT_ID]
}
`;
