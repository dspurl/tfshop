<?php

namespace App\Exports\v1;

use App\Code;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class IndentExport implements FromCollection, WithStrictNullComparison,
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
        $sheet->getStyle('A1:P1')->applyFromArray(['font' => ['bold' => true]]);
        $center = ['B','C','D','F','G','H','I'];
        foreach ($center as $c) {
            $sheet->getStyle($c)->applyFromArray(['alignment' => ['horizontal' => 'center']]);//设置水平居中
        }
        $cell = ['A', 'B', 'C', 'D', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];//需要合并的单元格
        foreach ($this->config as $c) {
            if ($c) {
                $cellCoordinate = explode(":", $c);
                foreach ($cell as $item) {
                    $sheet->mergeCells($item . $cellCoordinate[0] . ':' . $item . $cellCoordinate[1]);
                }
                $sheet->getStyle('A' . $cellCoordinate[0] . ':' . 'D' . $cellCoordinate[1])->getAlignment()->setVertical('center');//垂直居中
                $sheet->getStyle('I' . $cellCoordinate[0] . ':' . 'P' . $cellCoordinate[1])->getAlignment()->setVertical('center');//垂直居中
            }
        }
    }

    public function sheets(): array
    {
        $sheets = [];
        foreach ($this->data as $key => $data) {
            $sheets[] = new IndentExport($data, $this->config[$key], $key);
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
            __('observer.good_indent.finish_payment_notification.invoice.identification'),
            __('good_indent.type'),
            __('observer.good_indent.finish_payment_notification.invoice.state'),
            __('observer.good_indent.finish_payment_notification.invoice.total'),
            __('good_indent.indentCommodity.name'),
            __('good.type'),
            __('good.price'),
            __('good_indent.indentCommodity.number'),
            __('good_indent.carriage'),
            __('good_indent.consignee'),
            __('shipping.cellphone'),
            __('good_indent.address'),
            __('observer.good_indent.shipment_notification.invoice.dhl'),
            __('observer.good_indent.shipment_notification.invoice.odd'),
            __('good_indent.remark'),
            __('observer.good_indent.finish_payment_notification.invoice.time'),
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 30,
            'B' => 10,
            'C' => 10,
            'D' => 10,
            'E' => 50,
            'F' => 10,
            'G' => 10,
            'H' => 5,
            'I' => 10,
            'J' => 10,
            'K' => 10,
            'L' => 30,
            'M' => 15,
            'N' => 30,
            'O' => 50,
            'P' => 18,
        ];
    }

    public function collection()
    {
        return collect($this->data);
    }
}
