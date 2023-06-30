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

class MemberExport implements FromCollection, WithStrictNullComparison,
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
        $sheet->getStyle('A1:I1')->applyFromArray(['font' => ['bold' => true]]);
        $center = ['A','E','G'];
        foreach ($center as $c) {
            $sheet->getStyle($c)->applyFromArray(['alignment' => ['horizontal' => 'center']]);
        }
    }

    public function sheets(): array
    {
        $sheets[] = new MemberExport($this->data, $this->config, $this->title);
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
            __('admin.name'),
            __('user.nickname'),
            __('user.cellphone'),
            __('user.gender'),
            __('user.balance'),
            __('common.state'),
            __('user.registration_time'),
            __('user.last_login_int'),
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 10,
            'B' => 15,
            'C' => 15,
            'D' => 15,
            'E' => 10,
            'F' => 10,
            'G' => 10,
            'H' => 18,
            'I' => 18,
        ];
    }

    public function collection()
    {
        return collect($this->data);
    }
}
