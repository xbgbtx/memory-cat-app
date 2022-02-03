export namespace MemoryCatEvents {
  export interface BaseEvent {
    type: string;
  }

  export interface Config extends BaseEvent {
    gamesize: number;
  }

  export interface ReceivedCatUrl extends BaseEvent {
    data: string;
  }

  export interface CardDealt extends BaseEvent {
    cards: Array<Card>;
    dealt: number;
  }

  export interface CardClicked extends BaseEvent {
    card: number;
  }

  export interface CardRevealed extends BaseEvent {
    cards: Array<Card>;
    revealed: number;
  }

  export interface CardsHidden extends BaseEvent {
    cards: Array<Card>;
    hidden: Array<number>;
  }
}

export interface MemoryCatContext {
  gamesize: number;
  catUrls: Array<string>;
}

export interface CardTableContext {
  cards: Array<Card>;
  userPicks: Array<number>;
}

export interface Card {
  imageUrl: string;
  dealt: boolean;
  revealed: boolean;
}
