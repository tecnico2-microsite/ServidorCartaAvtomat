interface DBItem {
  REFPROVEEDOR: string;
  PRECIO_PVP1: number;
  CODMARCA: number;
  MDESC: string;
  CODLINEA: number;
  DESCRIPCION: string;
  TITULO_WEB: string;
  DESCRIPCION_WEB: string;
  OBSERVACION_WEB: string;
  NO_PUBLICAR_PRECIO: string;
  VISUALIZACION: string;
}

interface Articulo {
  id: string;
  titulo: string;
  precio?: string;
  descripcion: string;
  descripcion_adicional: string;
}

interface Subcategoria {
  nombre: string;
  articulos: Articulo[];
}

interface Categoria {
  nombre: string;
  subcategorias: Subcategoria[];
}

interface MenuResponse {
  categorias: Categoria[];
}

const toTitleCase = (text: string): string => {
  if (!text) return "";

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const parseMenuData = (dbData: DBItem[]): MenuResponse => {
  const sortedData = [...dbData].sort((a, b) => {
    if (a.CODMARCA !== b.CODMARCA) {
      return a.CODMARCA - b.CODMARCA;
    }

    return a.CODLINEA - b.CODLINEA;
  });

  const mapaCategorias = new Map<string, Map<string, Articulo[]>>();

  sortedData.forEach((item) => {
    const nombreCat = toTitleCase(item.MDESC);
    const nombreSubcat = toTitleCase(item.DESCRIPCION);

    if (!mapaCategorias.has(nombreCat)) {
      mapaCategorias.set(nombreCat, new Map());
    }

    const mapaSubcats = mapaCategorias.get(nombreCat)!;

    if (!mapaSubcats.has(nombreSubcat)) {
      mapaSubcats.set(nombreSubcat, []);
    }

    const nuevoArticulo: Articulo = {
      id: item.REFPROVEEDOR,
      titulo: item.TITULO_WEB,
      descripcion: item.DESCRIPCION_WEB || "",
      descripcion_adicional: item.OBSERVACION_WEB || "",
    };

    if (item.NO_PUBLICAR_PRECIO !== "T") {
      nuevoArticulo.precio = formatPrice(item.PRECIO_PVP1);
    }

    mapaSubcats.get(nombreSubcat)!.push(nuevoArticulo);
  });

  const categoriasFinales: Categoria[] = [];

  for (const [nombreCat, subcatsMap] of mapaCategorias) {
    const subcategoriasFinales: Subcategoria[] = [];

    for (const [nombreSubcat, articulos] of subcatsMap) {
      subcategoriasFinales.push({
        nombre: nombreSubcat,
        articulos: articulos,
      });
    }

    categoriasFinales.push({
      nombre: nombreCat,
      subcategorias: subcategoriasFinales,
    });
  }

  return { categorias: categoriasFinales };
};
