<?php

namespace App\Exports\v1;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class GoodExport implements FromCollection, WithStrictNullComparison,
    WithHeadings, WithColumnWidths, WithStyles, WithMultipleSheets, WithTitle
{

    protected $data;
    protected $config;
    protected $title;

    public function __construct(array $data, array $config, string $title)
    {
        $this->data = $data;
        $this->config = $config;
        $this->title = $title;
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getDefaultRowDimension()->setRowHeight(22);
        $sheet->getStyle('A1:N1')->applyFromArray(['font' => ['bold' => true]]);
        $center = ['A','E','H','I','L'];
        foreach ($center as $c) {
            $sheet->getStyle($c)->applyFromArray(['alignment' => ['horizontal' => 'center']]);
        }
    }

    public function sheets(): array
    {
        $sheets = [];
        foreach ($this->data as $key => $data) {
            $sheets[] = new GoodExport($data, $this->config[$key], $key);
        }
        return $sheets;
    }

    public function title(): string
    {
        return $this->title;
    }

    public function headings(): array
    {
        return [
            __('common.number'),
            __('good.type'),
            __('good_indent.indentCommodity.name'),
            __('good.price'),
            __('good.category_id'),
            __('good.number'),
            __('good.inventory'),
            __('good.sales'),
            __('common.state'),
            __('good.is_inventory'),
            __('good.is_recommend'),
            __('good.time'),
            __('good.update'),
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 10,
            'B' => 10,
            'C' => 50,
            'D' => 10,
            'E' => 12,
            'F' => 20,
            'G' => 10,
            'H' => 5,
            'I' => 12,
            'J' => 15,
            'K' => 10,
            'L' => 18,
            'M' => 18,
        ];
    }

    public function collection()
    {
        return collect($this->data);
    }
}
