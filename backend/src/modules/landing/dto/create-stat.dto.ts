import { IsString, IsNotEmpty } from 'class-validator';

export class CreateStatDto {
  @IsString()
  @IsNotEmpty({ message: 'El valor es requerido (ej: 15+)' })
  value: string;

  @IsString()
  @IsNotEmpty({ message: 'La etiqueta es requerida (ej: Años de experiencia)' })
  label: string;

  @IsString()
  @IsNotEmpty({ message: 'El subtexto es requerido' })
  sub: string;
}
