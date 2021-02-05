import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('foods')
class Food {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  standard_quantity: number;

  @Column()
  standard_quantity_unit: string;

  @Column()
  energy_kcal: number;

  @Column()
  energy_kj: number;

  @Column()
  carbs: number;

  @Column()
  proteins: number;

  @Column()
  fats: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Food;
