import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    firstName: string

    @Column("varchar", { length: 20 })
    lastName: string

    @Column("int")
    age: number

    @Column("varchar", { length: 100, unique: true })
    email: string

}
