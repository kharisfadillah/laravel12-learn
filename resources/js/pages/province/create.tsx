import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Province', href: '/province' },
  { title: 'Tambah', href: '/province/create' },
];

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    province_code: '',
    province_name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/province');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Provinsi" />

      <div className="max-w-xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Tambah Provinsi</CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="province_code">Kode Provinsi</Label>
                <Input
                  id="province_code"
                  value={data.province_code}
                  onChange={(e) => setData('province_code', e.target.value)}
                  placeholder="Contoh: ID-JB"
                />
                {errors.province_code && (
                  <div className="text-sm text-red-500 mt-1">{errors.province_code}</div>
                )}
              </div>

              <div>
                <Label htmlFor="province_name">Nama Provinsi</Label>
                <Input
                  id="province_name"
                  value={data.province_name}
                  onChange={(e) => setData('province_name', e.target.value)}
                  placeholder="Contoh: Jawa Barat"
                />
                {errors.province_name && (
                  <div className="text-sm text-red-500 mt-1">{errors.province_name}</div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-2">
              <Link href="/province">
                <Button type="button" variant="outline">Batal</Button>
              </Link>
              <Button type="submit" disabled={processing}>Simpan</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
