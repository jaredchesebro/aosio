/**
 * Device detector via matchMedia
 */

class Detector {
  phone() {
    return matchMedia(
      '(pointer: coarse) and (hover: none) and (max-width: 767px)',
    ).matches;
  }

  mobile() {
    return matchMedia('(pointer: coarse) and (hover: none)').matches;
  }

  tablet() {
    return this.mobile() && !this.phone();
  }
}

export default new Detector();
