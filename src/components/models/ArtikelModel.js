export default class ArtikelModel {
    title = '';
    pubDate = '';
    link = '';
    guid = '';
    author = '';
    thumbnail = '';
    description = '';
    content = '';
    categories = [];

    constructor(titles = '',
      pubdates = '',
      links = '',
      guids = '',
      authors = '',
      thumbnails = '',
      descriptions = '',
      contents = '',
      categoriess = [],
    ) {
      this.title = titles;
      this.pubDate = pubdates;
      this.link = links;
      this.guid = guids;
      this.author = authors;
      this.thumbnail = thumbnails;
      this.description = descriptions;
      this.content = contents;
      this.categories = categoriess;
    }
}
