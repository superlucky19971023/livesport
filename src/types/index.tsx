interface Match {
    homeTeam: string;
    homeID: any;
    awayTeam: string;
    awayID: any;
    homeScore: number;
    awayScore: number;
    status: string;id: number
}

interface MatchInfo {
    gmid: number;             // Game Match ID
    ename: string;            // Event name (e.g., "Rio Ave v Santa Clara")
    etid: number;             // Event type ID
    cid: number;              // Competition ID
    cname: string;            // Competition name (e.g., "PORTUGAL Liga Portugal")
    iplay: boolean;           // Is live/in play?
    stime: string;            // Scheduled time (ISO/Date string)
    tv: boolean;              // TV coverage available?
    bm: boolean;              // Bookmaker-related flag
    f: boolean;               // Flag (custom logic dependent)
    f1: boolean;              // Another flag
    iscc: number;             // Possibly a "coverage code" or status
    mid: number;              // Market ID
    mname: string;            // Market name (e.g., "MATCH_ODDS")
    status: string;           // Status (e.g., "OPEN", "CLOSED")
    rc: number;               // Result code or risk category (guess)
    gscode: number;           // Game score code
    m: number;                // Unknown; maybe match index
    oid: number;              // Odds ID
    gtype: string;            // Game type (e.g., "match")
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