export function getGreeting(): string {
    const now = new Date();
    const hours = now.getHours();
  
    if (hours < 12) {
      return "Good Morning";
    } else if (hours < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  }

  