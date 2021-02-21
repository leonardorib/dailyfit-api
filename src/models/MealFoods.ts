import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Food from './Food';
import Meal from './Meal';

@Entity('meals_foods')
class MealFoods {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  food_id: string;

  @Column()
  name: string;

  @ManyToOne(() => Food)
  @JoinColumn({ name: 'food_id' })
  @Column()
  meal_id: string;

  @ManyToOne(() => Meal)
  @JoinColumn({ name: 'meal_id' })
  @Column()
  quantity: number;

  @Column()
  quantity_unit: string;

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

export default MealFoods;
