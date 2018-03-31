export default class FeedItem {
    url = '';
    title = '';
    link = '';
    author = '';
    description = '';
    image = '';

    constructor(urls = '',
      titles = '',
      links = '',
      authors = '',
      descriptions = '',
      images = '',
    ) {
      this.url = urls;
      this.title = titles;
      this.link = links;
      this.author = authors;
      this.description = descriptions;
      this.image = images;
    }
}
