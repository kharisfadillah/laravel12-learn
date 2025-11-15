<?php

use App\Models\Company;
use Illuminate\Support\Facades\DB;

if (! function_exists('authorizedCompanyId')) {
    /**
     * Mendapatkan company id berdasarkan izin yang dimiliki user
     *
     * @param string $permission
     * @return array
     */
    function authorizedCompanyIds($permission): array
    {
        $companyIds = DB::table('user_role_company as urc')
            ->join('role_permission as rp', 'urc.role_id', '=', 'rp.role_id')
            ->join('permissions as p', 'rp.permission_id', '=', 'p.id')
            ->where('urc.user_id', auth()->id())
            ->where('p.name', $permission)
            ->select('urc.company_id')
            ->distinct()
            ->pluck('company_id')
            ->toArray();

        return $companyIds;
    }
}
