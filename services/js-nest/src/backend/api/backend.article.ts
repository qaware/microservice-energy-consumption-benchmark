import { BackendSection } from './backend.section';

export class BackendArticle {
  constructor(
    readonly title: string,
    readonly description: string,
    readonly authors: string[],
    readonly keywords: string[],
    readonly from_page: number,
    readonly to_page: number,
    readonly last_updated_at: Date,
    readonly sections: BackendSection[],
  ) {}
}

export class BackendArticleBuilder {
  private title_value: string;
  private description_value: string;
  private authors_value: string[];
  private keywords_value: string[];
  private from_page_value: number;
  private to_page_value: number;
  private last_updated_at_value: Date;
  private sections_value: BackendSection[];

  constructor() {}

  title(value: string): BackendArticleBuilder {
    this.title_value = value;
    return this;
  }

  description(value: string): BackendArticleBuilder {
    this.description_value = value;
    return this;
  }

  authors(value: string[]): BackendArticleBuilder {
    this.authors_value = value;
    return this;
  }

  keywords(value: string[]): BackendArticleBuilder {
    this.keywords_value = value;
    return this;
  }

  from_page(value: number): BackendArticleBuilder {
    this.from_page_value = value;
    return this;
  }

  to_page(value: number): BackendArticleBuilder {
    this.to_page_value = value;
    return this;
  }

  last_updated_at(value: Date): BackendArticleBuilder {
    this.last_updated_at_value = value;
    return this;
  }

  sections(value: BackendSection[]): BackendArticleBuilder {
    this.sections_value = value;
    return this;
  }

  build(): BackendArticle {
    return new BackendArticle(
      this.title_value,
      this.description_value,
      this.authors_value,
      this.keywords_value,
      this.from_page_value,
      this.to_page_value,
      this.last_updated_at_value,
      this.sections_value,
    );
  }
}
