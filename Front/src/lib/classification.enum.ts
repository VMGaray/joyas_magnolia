// Esta es una copia de los enums del backend para usarlos en el frontend
// Mantenerlos sincronizados es importante

export enum Category {
  Silver925 = 'Plata 925',
  Gold18k = 'Oro 18k',
  Plated = 'Enchapados',
  Personalized = 'Personalizados',
  Supplies = 'Insumos'
}

export enum ProductType {
  Rings = 'Anillos',
  Earrings = 'Aros',
  Chains = 'Cadenas',
  Pendants = 'Dijes',
  Bracelets = 'Pulseras',
  Sets = 'Conjuntos',
  Combos = 'Combos'
}

export enum RingsSubtypes {
  NaturalStones = 'Piedras naturales',
  CubicMicropave = 'Cubic y micropave',
  SWCrystal = 'Cristal SW',
  PlainSilver = 'Plata lisa',
  Stretch = 'Elastizados',
  Niolis = 'Niolis',
  Puffed = 'Inflados',
  MotherOfPearlAndPearls = 'Nacar y perlas',
  SilverAndGold = 'Plata y oro',
}

export enum EarringsSubtypes {
  Hoops = 'Argollas',
  Dangle = 'Colgantes',
  Studs = 'Pasantes',
  Sleepers = 'Abridores',
  Puffed = 'Inflados',
  WithPendants = 'Con dijes',
  Cuff = 'Cuff',
  Climbers = 'Trepadores',
  SilverAndGold = 'Plata y oro',
  Others = 'Otros',
}

export enum ChainsSubtypes {
  Rosaries = 'Denarios y rosarios',
  ExclusiveAndImportant = 'Exclusivas e importante',
  FineAndClassic = 'Finas y clasicas',
  MotherOfPearlAndPearls = 'Nacar y perlas',
  Stones = 'Piedras',
  Braided = 'Trenzas',
  Crystals = 'Cristales',
  Suede = 'Gamuza',
  WithPendants = 'Con dijes',
  Others = 'Otras',
  Men = 'Hombres',
}

export enum BraceletsSubtypes {
  ExclusiveAndImported = 'Exclusivas e importadas',
  NaturalStones = 'Piedras naturales',
  Stretch = 'Elastizadas',
  PlainSilver = 'Plata lisa',
  MotherOfPearlAndPearls = 'Nacar y perla',
  Crystals = 'Cristales',
  CubicAndMicro = 'Cubic y micro',
  Bangles = 'Esclavas',
  WithPendants = 'Con dijes',
  SuedeAndLeather = 'Gamuzas y cueros',
  SilverAndGold = 'Plata y oro',
  Men = 'Hombres',
}

export enum PendantsSubtypes {
  ForEngraving = 'Para grabar',
  Crystals = 'Cristales',
  Religious = 'Religiosos',
  Enameled = 'Esmaltados',
  ExclusiveAndImportant = 'Exclusivos e importantes',
  Stones = 'Piedras',
  Puffed = 'Inflados',
  CubicAndMicro = 'Cubic y micro',
  Plain = 'Liso',
  Initials = 'Iniciales',
  Others = 'Otros',
}

// Helper para obtener los subtipos según el tipo de producto
export function getSubtypesForProductType(productType: ProductType | string): Record<string, string> {
  switch (productType) {
    case ProductType.Rings:
        return Object.entries(RingsSubtypes).reduce((acc, [, value]) => {
        acc[value] = value;
        return acc;
      }, {} as Record<string, string>);
    case ProductType.Earrings:
        return Object.entries(EarringsSubtypes).reduce((acc, [, value]) => {
        acc[value] = value;
        return acc;
      }, {} as Record<string, string>);
    case ProductType.Chains:
        return Object.entries(ChainsSubtypes).reduce((acc, [, value]) => {
        acc[value] = value;
        return acc;
      }, {} as Record<string, string>);
    case ProductType.Bracelets:
        return Object.entries(BraceletsSubtypes).reduce((acc, [, value]) => {
        acc[value] = value;
        return acc;
      }, {} as Record<string, string>);
    case ProductType.Pendants:
        return Object.entries(PendantsSubtypes).reduce((acc, [, value]) => {
        acc[value] = value;
        return acc;
      }, {} as Record<string, string>);
    default:
      return {};
  }
}
