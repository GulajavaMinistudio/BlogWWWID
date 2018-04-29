// import moment from 'moment';
import parsedate from 'date-fns/parse';
import formatdate from 'date-fns/format';
import localeID from 'date-fns/locale/id';
import ArtikelModel from '@/components/models/ArtikelModel';

class ParserTanggal {
  tanggalMentah = '';

  parseTanggalKeBaku(valMentah) {
    this.tanggalMentah = valMentah;
    // ganti moment ke date-fns
    // 2018-02-16 04:13:04
    // const momentMentah = moment(this.tanggalMentah, 'YYYY-MM-DD HH:mm:ss');
    // const stringTanggalBaku = momentMentah.format('HH:mm, dddd DD MMM YYYY');
    const parsementah = parsedate(this.tanggalMentah, 'YYYY-MM-DD HH:mm:ss');
    const dateMentah = new Date(parsementah);
    const stringTanggalBaku = formatdate(dateMentah, 'HH:mm, dddd DD MMM YYYY', { locale: localeID });
    return stringTanggalBaku;
  }
}

class ParserDaftarArtikel {
  // array artikel baku
  artikelBaku = [];

  /**
   * konversi tanggal yang ada di dalam artikel
   * @param {Array} listArtikel daftar artikel dalam bentuk array
   */
  parseSusunArtikel(listArtikel = []) {
    const parserTanggal = new ParserTanggal();
    const panjangArtikel = listArtikel.length;
    for (let i = 0; i < panjangArtikel; i += 1) {
      const artikel = listArtikel[i];
      const tanggalbaku = parserTanggal.parseTanggalKeBaku(artikel.pubDate);
      const artikelDescBersih = ParserDaftarArtikel.extractTextFromHtml(artikel.description);
      const newsModel = new ArtikelModel(
        artikel.title,
        tanggalbaku,
        artikel.link,
        artikel.guid,
        artikel.author,
        artikel.thumbnail,
        artikelDescBersih,
        artikel.content,
        artikel.categories,
      );
      this.artikelBaku.push(newsModel);
    }
    return this.artikelBaku;
  }

  static extractTextFromHtml(stringHtml) {
    // const artikelCleanHTML = $(stringHtml).text();
    const artikelCleanHTML = stringHtml.replace(/<[^>]*>?/g, '');
    return artikelCleanHTML;
  }
}

class ParserKategori {
  listKategori = [];

  /**
   * @description parse array kategori artikel ke dalam bentuk satu array saja
   * @param {Array} listArtikel daftar artikel
   */
  parseKategoriSemuaArtikel(listArtikel = []) {
    const panjangArtikel = listArtikel.length;
    const listkategorimentah = [];
    for (let i = 0; i < panjangArtikel; i += 1) {
      const artikel = listArtikel[i];
      const categories = artikel.categories;
      const panjangKategori = categories.length;
      for (let j = 0; j < panjangKategori; j += 1) {
        const namaKategori = categories[j];
        listkategorimentah.push(namaKategori);
      }
    }

    const listkategoriurut = listkategorimentah.sort(
      (nilaiA, nilaiB) => {
        // urutkan secara ascending
        if (nilaiA < nilaiB) {
          return -1;
        }
        if (nilaiA > nilaiB) {
          return 1;
        }
        return 0;
      },
    );

    // dengan reduce dan filter
    // this.listKategori = listkategoriurut.reduce((accumulatorVal, currentVal) => {
    //   const panjangAccumulator = accumulatorVal.length;
    //   if (panjangAccumulator === 0) {
    //     accumulatorVal.push(currentVal);
    //   } else {
    //     const kategoriUnikArray = accumulatorVal.filter(value => currentVal === value);
    //     if (!kategoriUnikArray[0]) {
    //       accumulatorVal.push(currentVal);
    //     }
    //   }
    //   return accumulatorVal;
    // }, []);

    // cari berdasarkan indeks kata ditemukan
    // ['ada','berita','ada','kata','saja']
    this.listKategori = listkategoriurut.filter((value, index, arrayself) => {
      const indexFind = arrayself.findIndex(valuefindindex => value.toString()
        .toLowerCase() === valuefindindex.toString().toLowerCase());
      return index === indexFind;
    });
    return this.listKategori;
  }
}

export { ParserTanggal, ParserKategori, ParserDaftarArtikel };

