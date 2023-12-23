import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionItemFormat'
})
export class TransactionItemFormatPipe implements PipeTransform {

  transform(value: string): string {
    switch(value) {
      case 'miningLevel': return 'mL';
      case 'miningSpeed': return 'mS';
      case 'energyRegeneration': return 'eRegen';
      default: return value;
    }
  }

}
