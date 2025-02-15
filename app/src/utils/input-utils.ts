import prompts from "prompts";

const parseUserInput = (input: string): string | null => {
  const trimmedInput = input.trim();
  if (!trimmedInput) {
    return null;
  }
  return trimmedInput;
};

const getUserInput = async (): Promise<string | null> => {
  const response = await prompts(
    {
      type: "text",
      name: "userInput",
      message: "🔑 Enter your Staff Pass ID (or type 'exit' to quit):",
    },
    {
      onCancel: () => {
        process.exit(0);
      },
    },
  );

  return parseUserInput(response.userInput);
};

export { parseUserInput, getUserInput };
