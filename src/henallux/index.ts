import { env } from "@/env";
import { unstable_cache } from "next/cache";

export const getImplentations = unstable_cache(
  INTERNAL_getImplentations,
  ["implentation"],
  { revalidate: 24 * 60 * 60 },
);

async function INTERNAL_getImplentations() {
  const response = await fetch(
    "https://portail.henallux.be/api/implantations/my",
    {
      headers: {
        Authorization: `Bearer ${env.BEARER_TOKEN}`,
      },
    },
  );
  try {
    const res = (await response.json()) as {
      success: number;
      data: {
        code: string;
        actif: string;
        fireActif: string;
        interActif: string;
        isCours: string;
        id: number;
        site_name: string;
        implantation_name: string;
        international_code: string;
        key: number;
        value: string;
      }[];
      count: number;
      message: string;
      code: number;
    };
    return res.data.map((impl) => {
      return {
        key: impl.key,
        name: impl.implantation_name,
      };
    });
  } catch (e) {
    return null;
  }
}

async function INTERNAL_getOrientations(implentation_id: number) {
  const response = await fetch(
    `https://portail.henallux.be/api/orientations/implantation/${implentation_id}`,
    {
      headers: {
        Authorization: `Bearer ${env.BEARER_TOKEN}`,
      },
    },
  );
  const res = (await response.json()) as {
    success: boolean;
    data: {
      id: number;
      tri: number;
      code_proeco_dep: string;
      code: string;
      code_unique: string;
      code_ref: string;
      codeeurope: number;
      categorie: string;
      sousect: string;
      sousectexpansion: string;
      sousectanglais: string;
      intitule: string;
      intitule_paysage: string;
      intituleanglais: string;
      type: string;
      active: string;
      international: string;
      paysage: string;
      bib: string;
      idtech: number;
      respcycle: string;
      respimpl: string;
      idDepartement: number;
      valid_B1: string;
      valid_B2: string;
      valid_B3: string;
      valid_B4: string;
      nb_blocs: string;
      code_ue_min: string;
      debut: number;
      fin: number;
      id_cursus: string;
      id_implantation: number;
      key: number;
      value: string;
    }[];
    count: number;
    message: string;
    code: number;
  };

  return res.data.map((orientation) => {
    return {
      key: orientation.key,
      name: orientation.intitule,
      code_ue_min: orientation.code_ue_min,
      intitule_paysage: orientation.intitule_paysage,
    };
  });
}

export const getOrientations = unstable_cache(
  INTERNAL_getOrientations,
  ["orientation"],
  { revalidate: 24 * 60 * 60 },
);

async function INTERNAL_getYear(
  implentation_id: number,
  orientation_id: number,
) {
  const response = await fetch(
    `https://portail.henallux.be/api/classes/orientation_and_implantation/${orientation_id}/${implentation_id}`,
    {
      headers: {
        Authorization: `Bearer ${env.BEARER_TOKEN}`,
      },
    },
  );

  const res = (await response.json()) as {
    success: boolean;
    data: {
      id: number;
      promotion_id: string;
      promotion_label: string;
      implantation_id: string;
      implantation_label: string;
      orientation_id: string;
      orientation_label: string;
      annee: string;
      classe: string;
      code_hyperplanning: string;
      id_hyperplanning: string;
      created_at: string;
      updated_at: string;
      key: number;
      value: string;
    }[];
    count: number;
    message: string;
    code: number;
  };

  return res.data.map((year) => {
    return {
      key: year.key,
      name: year.promotion_label,
    };
  });
}

export const getYear = unstable_cache(INTERNAL_getYear, ["year"], {
  revalidate: 6 * 60 * 60,
});

async function INTERNAL_getClass(
  year_id: number,
  orientation_id: number,
  implantation_id: number,
) {
  const response = await fetch(
    `https://portail.henallux.be/api/classes/classe_and_orientation_and_implantation/${year_id}/${orientation_id}/${implantation_id}`,
    {
      headers: {
        Authorization: `Bearer ${env.BEARER_TOKEN}`,
      },
    },
  );
  const res = (await response.json()) as {
    success: boolean;
    data: {
      id: number;
      promotion_id: string;
      promotion_label: string;
      implantation_id: string;
      implantation_label: string;
      orientation_id: string;
      orientation_label: string;
      annee: string;
      classe: string;
      code_hyperplanning: string;
      id_hyperplanning: string;
      created_at: string;
      updated_at: string;
      key: number;
      value: string;
    }[];
    count: number;
    message: string;
    code: number;
  };

  return res.data.map((year) => {
    return {
      key: year.key,
      name: year.promotion_label,
    };
  });
}

export const getClass = unstable_cache(INTERNAL_getClass, ["class"], {
  revalidate: 6 * 60 * 60,
});

async function INTERNAL_getCourse(class_id: number) {
  const response = await fetch(
    `https://portail.henallux.be/api/plannings/promotion/[%22${class_id}%22]`,
    {
      headers: {
        Authorization: `Bearer ${env.BEARER_TOKEN}`,
      },
    },
  );

  const res = (await response.json()) as {
    CATEGORIES: string;
    created_date: string;
    modified_date: string;
    title: string;
    start: string;
    end: string;
    text: string;
    location: string;
    details: string;
    promotions: string;
    "X-ALT-DESC;FMTTYPE=text/html": string;
  }[];
  const courses = res.map((r) => ({
    location: r.location,
    title: r.title,
    start: r.start,
    end: r.end,
    promotions: r.promotions,
    text: r.text.split(" - ")[0],
  }));
  return {
    courses,
    class_id,
  };
}

export const getCourse = unstable_cache(INTERNAL_getCourse, ["course"], {
  revalidate: 6 * 60 * 60,
});

async function INTERNAL_getLocaux(implentation_id: number) {
  const response = await fetch(
    `https://portail.henallux.be/api/locals/implantation/${implentation_id}`,
    {
      headers: {
        Authorization: `Bearer ${env.BEARER_TOKEN}`,
      },
    },
  );
  const res = (await response.json()) as {
    success: boolean;
    data: {
      id: number;
      id_hyperplanning: string;
      local_name: string;
      implantation_prefix: string;
      implantation_name: string;
      implantation_id: string;
      created_at: string;
      updated_at: string;
      key: number;
      value: string;
    }[];
    count: number;
    message: string;
    code: number;
  };
  return res.data.map((local) => {
    return {
      key: local.id,
      name: local.local_name,
    };
  });
}

export const getLocaux = unstable_cache(INTERNAL_getLocaux, ["locaux"], {
  revalidate: 8 * 60 * 60,
});

async function INTERNAL_getLocalSchedule(local_id: number, today: Date) {
  const response = await fetch(
    `https://portail.henallux.be/api/plannings/local/[%22${local_id}%22]`,
    {
      headers: {
        Authorization: `Bearer ${env.BEARER_TOKEN}`,
      },
    },
  );
  const res = (await response.json()) as {
    CATEGORIES: string;
    created_date: string;
    modified_date: string;
    title: string;
    start?: string; //20240515T170000Z
    end?: string; // 20240515T170000Z
    text: string;
    location: string;
    details: string;
    promotions: string;
    "X-ALT-DESC;FMTTYPE=text/html": string;
  }[];

  const schedule = res.map((r) => ({
    title: r.title,
    start: r.start
      ? new Date(
          r.start.replace(
            /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/,
            "$1-$2-$3T$4:$5:$6Z",
          ),
        )
      : null,
    end: r.end
      ? new Date(
          r.end.replace(
            /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/,
            "$1-$2-$3T$4:$5:$6Z",
          ),
        )
      : null,
    location: r.location,
    text: r.text,
  }));
  return schedule.filter((s) => {
    if (!s.start || !s.end) {
      return false;
    }
    return (
      s.start.getDate() === today.getDate() &&
      s.start.getMonth() === today.getMonth() &&
      s.start.getFullYear() === today.getFullYear()
    );
  });
}

export const getLocalSchedule = unstable_cache(
  INTERNAL_getLocalSchedule,
  ["local_schedule"],
  { revalidate: 6 * 60 * 60 },
);
