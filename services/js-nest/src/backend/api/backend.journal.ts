import { BackendArticle } from './backend.article';

export class BackendJournal {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly title: string,
    readonly issue: number,
    readonly publisher: string,
    readonly published_at: Date,
    readonly editors: string[],
    readonly url: string,
    readonly articles: BackendArticle[],
  ) {}
}

export class BackendJournalBuilder {
  private id_value: string;
  private name_value: string;
  private title_value: string;
  private issue_value: number;
  private publisher_value: string;
  private published_at_value: Date;
  private editors_value: string[];
  private url_value: string;
  private articles_value: BackendArticle[];

  constructor() {}

  id(value: string): BackendJournalBuilder {
    this.id_value = value;
    return this;
  }

  name(value: string): BackendJournalBuilder {
    this.name_value = value;
    return this;
  }

  title(value: string): BackendJournalBuilder {
    this.name_value = value;
    return this;
  }

  issue(value: number): BackendJournalBuilder {
    this.issue_value = value;
    return this;
  }

  publisher(value: string): BackendJournalBuilder {
    this.publisher_value = value;
    return this;
  }

  published_at(value: Date): BackendJournalBuilder {
    this.published_at_value = value;
    return this;
  }

  editors(value: string[]): BackendJournalBuilder {
    this.editors_value = value;
    return this;
  }

  url(value: string): BackendJournalBuilder {
    this.url_value = value;
    return this;
  }

  articles(value: BackendArticle[]): BackendJournalBuilder {
    this.articles_value = value;
    return this;
  }

  build(): BackendJournal {
    return new BackendJournal(
      this.id_value,
      this.name_value,
      this.title_value,
      this.issue_value,
      this.publisher_value,
      this.published_at_value,
      this.editors_value,
      this.url_value,
      this.articles_value,
    );
  }
}
