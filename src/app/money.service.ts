import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class MoneyService {
    private moneyMap = new Map<string, number>();
    
    constructor() {}

    setMoney(playerId: string, amount: number): void {
        this.moneyMap.set(playerId, amount);
    }

    getMoney(playerId: string): number {
        return this.moneyMap.get(playerId) ?? -1;
    }

    addMoney(playerId: string, amount: number): void {
        const currentAmount = this.moneyMap.get(playerId) || 0;
        this.moneyMap.set(playerId, currentAmount + amount);
    }

    subtractMoney(playerId: string, amount: number): void {        
        const currentAmount = this.moneyMap.get(playerId) || 0;
        if (currentAmount >= amount) {
            this.moneyMap.set(playerId, currentAmount - amount);
        } else {
            this.moneyMap.set(playerId, 0);
        }
    }

    getAllMoney(): Map<string, number> {
        return this.moneyMap;
    }

    clear(){
        this.moneyMap = new Map<string, number>();
    }
}