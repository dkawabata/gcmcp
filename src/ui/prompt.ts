import inquirer from 'inquirer'

export async function promptToggle(options: {
  title: string
  choices: { name: string; value: string; checked?: boolean; hint?: string }[]
}): Promise<string[]> {
  const { selected } = await inquirer.prompt<{ selected: string[] }>([
    {
      type: 'checkbox',
      name: 'selected',
      message: options.title,
      choices: options.choices.map((c) => ({ ...c })),
      pageSize: 15,
    },
  ])
  return selected
}

