import prompts from "prompts";

const parseUserInput = (input: string): string | null => {
  const trimmedInput = input.trim();
  if (!trimmedInput) {
    return null;
  }
  return trimmedInput;
};

const getUserInput = async (): Promise<string> => {
  const response = await prompts({
    type: "text",
    name: "userInput",
    message: "🔑 Enter your Staff Pass ID (or type 'exit' to quit):",
  });

  return response.userInput;
};

export { parseUserInput, getUserInput };
