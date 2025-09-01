export interface Material {
  id?: string;
  isActive: boolean;
  stock: number;
  unitOfMeasure: string;
  name: string;
  quantityMaterial: number;
  widthMaterial: number;
  heightMaterial: number;

  standId: string;
}