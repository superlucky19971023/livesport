interface Match {
    homeTeam: string;
    homeID: any;
    awayTeam: string;
    awayID: any;
    homeScore: number;
    awayScore: number;
    status: string;
}

interface Competition {
    key: string
    kind: string
    name: string
    icon?: string
    matches: Match[]
}

interface Day {
    date: string;
    matchCount: string;
    competitions: Competition[];
}

interface ScrollState {
    scrollIsVisible: boolean;
    setIsVisible: (scrollIsVisible: boolean) => void;
}

interface SportTab {
    id: string
    label: string
    icon: string
  }