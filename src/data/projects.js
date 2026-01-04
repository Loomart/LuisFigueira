import defraggImg from '../assets/images/portfolio/deffrag.webp';
import gxupWebsiteImg from '../assets/images/portfolio/gxupWeb.webp';
import gxupVrImg from '../assets/images/portfolio/gxupVr.webp';
import nccSocGest from '../assets/images/portfolio/nccSocgest.webp';

export const projects = [
  {
    title: 'Defragg',
    image: defraggImg,
    descriptionKey: 'projects.defragg.description',
    tech: ['Unity', 'C#'],
    link: '#'
  },
  {
    title: 'Gxup Site',
    image: gxupWebsiteImg,
    descriptionKey: 'projects.gxupsite.description',
    tech: ['HTML', 'CSS', 'JavaScript'],
    link: '#'
  },
  {
    title: 'Gxup Vr',
    image: gxupVrImg,
    descriptionKey: 'projects.gxupvr.description',
    tech: ['Unity', 'C#', '3D'],
    link: '#'
  },
  {
    title: 'Ncc Soc Gest',
    image: nccSocGest,
    descriptionKey: 'projects.nccsocgest.description',
    tech: ['Visual Basic'],
    link: '#'
  }
];
