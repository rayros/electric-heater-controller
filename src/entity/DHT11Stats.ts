import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

export class ColumnNumericTransformer {
    to(data: number): number {
        return data;
    }
    from(data: string): number {
        return parseFloat(data);
    }
}

@Entity()
export class DHT11Stats {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    device_id: string

    @Column({
        type: 'decimal',
        transformer: new ColumnNumericTransformer(),
    })
    temperature: number

    @Column({
        type: 'decimal',
        transformer: new ColumnNumericTransformer(),
    })
    humidity: number

    @Column({
        type: 'decimal',
        transformer: new ColumnNumericTransformer(),
    })
    dewPoint: number

    @CreateDateColumn()
    date: Date
}
