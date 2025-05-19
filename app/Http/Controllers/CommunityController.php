<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommunityRequest;
use App\Http\Requests\UpdateCommunityRequest;
use App\Models\Community;
use App\Models\Image;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image as ImageIntervention;


class CommunityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    use AuthorizesRequests;

    public function index()
    {
        $communities = Community::select('id', 'nombre', 'descripcion', 'visibilidad')->with('user', 'profileImage', 'backgroundImage', 'members')->get();

        return inertia('Communities/Index', [
            'communities' => $communities,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCommunityRequest $request)
    {

        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:255',
            'visibilidad' => 'required|string|in:publico,privado',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'background_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $community = Community::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'visibilidad' => $request->visibilidad,
            'user_id' => Auth::user()->id,
        ]);

        $community->members()->attach(Auth::user()->id);

        if ($request->hasFile('profile_image')) {

            $imagen = $request->file('profile_image');
            $extension = $imagen->getClientOriginalExtension();
            $path_aws = 'https://e-shelf-bucket.s3.eu-north-1.amazonaws.com/';
            $path_original = "public/communities/{$community->id}/profile_image/original/{$community->id}.{$extension}";
            $path_medium = "public/communities/{$community->id}/profile_image/medium/{$community->id}.{$extension}";
            $path_small = "public/communities/{$community->id}/profile_image/small/{$community->id}.{$extension}";

            $smallImage = ImageIntervention::read($imagen)->scale( height: 350)->encode();

            Storage::disk('s3')->put($path_small, $smallImage, 'public');

            $image = new Image([
                'path_small' => $path_aws . $path_small,
                'type' => 'profile',

            ]);

            $image->imageable()->associate($community)->save();
        }

        if ($request->hasFile('background_image')) {

            $imagen = $request->file('background_image');
            $extension = $imagen->getClientOriginalExtension();
            $path_aws = 'https://e-shelf-bucket.s3.eu-north-1.amazonaws.com/';
            $path_original = "public/communities/{$community->id}/background_image/original/{$community->id}.{$extension}";
            $path_medium = "public/communities/{$community->id}/background_image/medium/{$community->id}.{$extension}";
            $path_small = "public/communities/{$community->id}/background_image/small/{$community->id}.{$extension}";

            $imagen = ImageIntervention::read($imagen)->encodeByMediaType(quality: 75);
            $mediumImage = ImageIntervention::read($imagen)->scale( height: 600)->encode();

            Storage::disk('s3')->put($path_original, $imagen, 'public');
            Storage::disk('s3')->put($path_medium, $mediumImage, 'public');

            $image = new Image([
                'path_original' => $path_aws . $path_original,
                'path_medium' => $path_aws . $path_medium,
                'type' => 'background',

            ]);

            $image->imageable()->associate($community)->save();
        }

        $community->save();

        return redirect()->route('mis-comunidades');

    }

    /**
     * Display the specified resource.
     */
    public function show(Community $community)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Community $community)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCommunityRequest $request, Community $community)

    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:255',
            'visibilidad' => 'required|string|in:publico,privado',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'background_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $community->update([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'visibilidad' => $request->visibilidad,
        ]);

        if ($request->hasFile('profile_image')) {

            $imagen = $request->file('profile_image');
            $extension = $imagen->getClientOriginalExtension();
            $path_aws = 'https://e-shelf-bucket.s3.eu-north-1.amazonaws.com/';
            $path_original = "public/communities/{$community->id}/profile_image/original/{$community->id}.{$extension}";
            $path_medium = "public/communities/{$community->id}/profile_image/medium/{$community->id}.{$extension}";
            $path_small = "public/communities/{$community->id}/profile_image/small/{$community->id}.{$extension}";

            if($community->profileImage){
                $paths = [
                    ltrim(parse_url($community->profileImage->path_small, PHP_URL_PATH), '/'),
                ];

                Storage::disk('s3')->delete($paths);

                $community->profileImage()->delete();
            }


            $smallImage = ImageIntervention::read($imagen)->scale( height: 350)->encode();

            Storage::disk('s3')->put($path_small, $smallImage, 'public');

            if($community->profileImage){
                // Actualizamos la foto asociada al post
                $community->profileImage()->update([
                    'path_small' => $path_aws . $path_small,
                ]);
            } else {

                $image = new Image([
                    'path_small' => $path_aws . $path_small,
                    'type' => 'profile',

                ]);

                $image->imageable()->associate($community)->save();

            }

        }

        if ($request->hasFile('background_image')) {

            $imagen = $request->file('background_image');
            $extension = $imagen->getClientOriginalExtension();
            $path_aws = 'https://e-shelf-bucket.s3.eu-north-1.amazonaws.com/';
            $path_original = "public/communities/{$community->id}/background_image/original/{$community->id}.{$extension}";
            $path_medium = "public/communities/{$community->id}/background_image/medium/{$community->id}.{$extension}";
            $path_small = "public/communities/{$community->id}/background_image/small/{$community->id}.{$extension}";

            if($community->backgroundImage){
                $paths = [
                    ltrim(parse_url($community->backgroundImage->path_original, PHP_URL_PATH), '/'),
                    ltrim(parse_url($community->backgroundImage->path_medium, PHP_URL_PATH), '/'),
                ];

                Storage::disk('s3')->delete($paths);

                $community->backgroundImage()->delete();
            }


            $imagen = ImageIntervention::read($imagen)->encodeByMediaType(quality: 75);
            $mediumImage = ImageIntervention::read($imagen)->scale( height: 600)->encode();

            Storage::disk('s3')->put($path_original, $imagen, 'public');
            Storage::disk('s3')->put($path_medium, $mediumImage, 'public');

            if($community->backgrounImage){
                // Actualizamos la foto asociada al post
                $community->backgroundImage()->update([
                    'path_original' => $path_aws . $path_original,
                    'path_medium' => $path_aws . $path_medium,

                ]);
            } else {

                $image = new Image([
                    'path_original' => $path_aws . $path_original,
                    'path_medium' => $path_aws . $path_medium,
                    'type' => 'background',

                ]);

                $image->imageable()->associate($community)->save();

            }

        }

        $community->save();

        return redirect()->back();

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Community $community)
    {
        $this->authorize('delete', $community);
        $community->delete();
    }

    public function destroyImage(Community $community, $imageType)
{

    if($imageType == 'profile_image'){

        if($community->profileImage){

            $paths = [
            ltrim(parse_url($community->profileImage->path_small, PHP_URL_PATH), '/'),
            ];
            // Eliminar archivos de AWS S3
            Storage::disk('s3')->delete($paths);

            // Eliminar el registro de la base de datos
            $community->profileImage->delete();
        }
    }

    if($imageType == 'background_image'){

        if($community->backgroundImage){

            $paths = [
            ltrim(parse_url($community->backgroundImage->path_original, PHP_URL_PATH), '/'),
            ltrim(parse_url($community->backgroundImage->path_medium, PHP_URL_PATH), '/'),
            ];
            // Eliminar archivos de AWS S3
            Storage::disk('s3')->delete($paths);

            // Eliminar el registro de la base de datos
            $community->backgroundImage->delete();
        }
    }

}

    public function join(Community $community)
    {
        $user = Auth::user();

        if (!$community->members->contains($user->id)) {
            $community->members()->attach($user->id);
        }

        return back();
    }

    public function leave(Community $community)
    {
        $user = Auth::user();

        foreach ($user->posts as $post) {
            if ($post->posteable->communities->contains($community->id)) {
                $post->posteable->communities()->detach($community->id);
            }
        }

        if ($community->members->contains($user->id)) {
            $community->members()->detach($user->id);
        }

        return back();
    }

}
