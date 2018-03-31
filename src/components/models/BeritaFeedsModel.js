import FeedItem from '@/components/models/FeedItem';

export default class BeritaFeedsModel {
    status = '';
    feed = {};
    items = [];

    constructor(
      statuses = '',
      feeds = new FeedItem(),
      itemses = [],
    ) {
      this.status = statuses;
      this.feed = feeds;
      this.items = itemses;
    }
}
