export type WelcomeText = {
  title: string;
  description: string;
}

export type OpenMicStatus = {
  active: boolean;
  next_date: string | null;
  message: string;
}