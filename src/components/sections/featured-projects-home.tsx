import { getTranslations } from "next-intl/server";
import { FeaturedProjectsInteractive } from "./featured-projects-interactive";

const projectData = [
  {
    id: "outdoor-kitchen",
    index: "01",
    category: "Outdoor Construction",
    src: "/images/projects/outdoor-kitchen.jpeg",
    imagePosition: "object-[50%_52%]",
    sizes: "(min-width: 1024px) 70vw, (min-width: 768px) 50vw, 100vw",
  },
  {
    id: "interior-renovation",
    index: "02",
    category: "Interior Remodeling",
    src: "/images/projects/interior-renovation.jpeg",
    imagePosition: "object-[50%_58%]",
    sizes: "(min-width: 1024px) 70vw, (min-width: 768px) 50vw, 100vw",
  },
  {
    id: "bathroom-remodel",
    index: "03",
    category: "Remodeling",
    src: "/images/projects/bathroom-remodel.jpeg",
    imagePosition: "object-[50%_58%]",
    sizes: "(min-width: 1024px) 70vw, (min-width: 768px) 50vw, 100vw",
  },
  {
    id: "kitchen-countertops",
    index: "04",
    category: "Kitchen Remodeling",
    src: "/images/projects/kitchen-countertops.jpeg",
    imagePosition: "object-[48%_50%]",
    sizes: "(min-width: 1024px) 70vw, (min-width: 768px) 50vw, 100vw",
  },
] as const;

export async function FeaturedProjectsHome() {
  const t = await getTranslations("FeaturedProjects");

  const projects = [
    {
      id: projectData[0].id,
      index: projectData[0].index,
      title: t("items.outdoorKitchen.title"),
      category: projectData[0].category,
      src: projectData[0].src,
      imagePosition: projectData[0].imagePosition,
      sizes: projectData[0].sizes,
      alt: t("items.outdoorKitchen.imageAlt"),
    },
    {
      id: projectData[1].id,
      index: projectData[1].index,
      title: t("items.interiorRenovation.title"),
      category: projectData[1].category,
      src: projectData[1].src,
      imagePosition: projectData[1].imagePosition,
      sizes: projectData[1].sizes,
      alt: t("items.interiorRenovation.imageAlt"),
    },
    {
      id: projectData[2].id,
      index: projectData[2].index,
      title: t("items.bathroomRemodel.title"),
      category: projectData[2].category,
      src: projectData[2].src,
      imagePosition: projectData[2].imagePosition,
      sizes: projectData[2].sizes,
      alt: t("items.bathroomRemodel.imageAlt"),
    },
    {
      id: projectData[3].id,
      index: projectData[3].index,
      title: t("items.kitchenCountertops.title"),
      category: projectData[3].category,
      src: projectData[3].src,
      imagePosition: projectData[3].imagePosition,
      sizes: projectData[3].sizes,
      alt: t("items.kitchenCountertops.imageAlt"),
    },
  ];

  return (
    <FeaturedProjectsInteractive
      eyebrow={t("eyebrow")}
      sectionTitle={t("title")}
      description={t("description")}
      viewAll={t("viewAll")}
      projects={projects}
    />
  );
}
