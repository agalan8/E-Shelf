<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommunityRequest;
use App\Http\Requests\UpdateCommunityRequest;
use App\Models\Community;
use App\Models\CommunityMembership;
use App\Models\Image;
use App\Models\User;
use App\Notifications\CommunityAccepted;
use App\Notifications\CommunityDenied;
use App\Notifications\CommunityJoinRequest;
use FFI\CData;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image as ImageIntervention;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class CommunityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    use AuthorizesRequests;

    public function index()
    {
        $communities = Community::select('id', 'nombre', 'descripcion', 'visibilidad', 'user_id')
            ->with('user', 'profileImage', 'backgroundImage', 'memberships')
            ->get()
            ->map(function ($community) {
                $community->getTotalMembers = $community->getTotalMembers();
                $community->getTotalPosts = $community->getTotalPosts();
                return $community;
            });

        return inertia('Communities/Index', [
            'communities' => $communities,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

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

        CommunityMembership::create([
            'user_id' => Auth::user()->id,
            'community_id' => $community->id,
            'community_role_id' => 1,
        ]);


        if ($request->hasFile('profile_image')) {

            $imagen = $request->file('profile_image');
            $extension = $imagen->getClientOriginalExtension();
            $path_aws = 'https://e-shelf-bucket.s3.eu-north-1.amazonaws.com/';
            $path_original = "public/communities/{$community->id}/profile_image/original/{$community->id}.{$extension}";
            $path_medium = "public/communities/{$community->id}/profile_image/medium/{$community->id}.{$extension}";
            $path_small = "public/communities/{$community->id}/profile_image/small/{$community->id}.{$extension}";

            $smallImage = ImageIntervention::read($imagen)->scale(height: 350)->encode();

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
            $mediumImage = ImageIntervention::read($imagen)->scale(height: 600)->encode();

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
        // Cargar comunidad con relaciones
        $community->load([
            'user',
            'profileImage',
            'backgroundImage',
            'memberships',
        ]);

        $community->getTotalMembers = $community->getTotalMembers();
        $community->getTotalPosts = $community->getTotalPosts();

        // Obtener posts de la comunidad con todas sus relaciones
        $posts = $community->posts()
            ->with([
                'comments.user',
                'image',
                'post.user', // si es re-post
                'tags',
                'communities',
                'likedBy',
            ])
            ->latest()
            ->get()
            ->map(function ($post) {
                $post->getTotalLikes = $post->getTotalLikes();
                $post->isLikedByUser = $post->isLikedByUser();
                return $post;
            });

        return Inertia::render('Communities/Show', [
            'community' => $community,
            'posts' => $posts,
        ]);
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

            if ($community->profileImage) {
                $paths = [
                    ltrim(parse_url($community->profileImage->path_small, PHP_URL_PATH), '/'),
                ];

                Storage::disk('s3')->delete($paths);

                $community->profileImage()->delete();
            }


            $smallImage = ImageIntervention::read($imagen)->scale(height: 350)->encode();

            Storage::disk('s3')->put($path_small, $smallImage, 'public');

            if ($community->profileImage) {
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

            if ($community->backgroundImage) {
                $paths = [
                    ltrim(parse_url($community->backgroundImage->path_original, PHP_URL_PATH), '/'),
                    ltrim(parse_url($community->backgroundImage->path_medium, PHP_URL_PATH), '/'),
                ];

                Storage::disk('s3')->delete($paths);

                $community->backgroundImage()->delete();
            }


            $imagen = ImageIntervention::read($imagen)->encodeByMediaType(quality: 75);
            $mediumImage = ImageIntervention::read($imagen)->scale(height: 600)->encode();

            Storage::disk('s3')->put($path_original, $imagen, 'public');
            Storage::disk('s3')->put($path_medium, $mediumImage, 'public');

            if ($community->backgrounImage) {
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

        if ($imageType == 'profile_image') {

            if ($community->profileImage) {

                $paths = [
                    ltrim(parse_url($community->profileImage->path_small, PHP_URL_PATH), '/'),
                ];
                // Eliminar archivos de AWS S3
                Storage::disk('s3')->delete($paths);

                // Eliminar el registro de la base de datos
                $community->profileImage->delete();
            }
        }

        if ($imageType == 'background_image') {

            if ($community->backgroundImage) {

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

        if ($community->visibilidad === 'publico') {

            CommunityMembership::create([
                'user_id' => Auth::user()->id,
                'community_id' => $community->id,
                'community_role_id' => 3,
            ]);
        }

        if ($community->visibilidad === 'privado') {
            $user = User::findOrFail(Auth::user()->id);

            CommunityMembership::create([
                'user_id' => Auth::user()->id,
                'community_id' => $community->id,
                'community_role_id' => 4,
            ]);

            $adminUsers = CommunityMembership::where('community_id', $community->id)
                ->whereIn('community_role_id', [1, 2]) // 1: owner, 2: admin
                ->with('user')
                ->get()
                ->pluck('user');

            // Enviar la notificación a cada uno
            foreach ($adminUsers as $adminUser) {
                $adminUser->notify(new  CommunityJoinRequest($community, $user));
            }
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

        $community->memberships()->where('user_id', Auth::id())->delete();

        if ($community->visibilidad === 'privado') {
            return redirect()->route('mis-comunidades');
        }


        return back();
    }

    public function accept(Request $request)
    {
        $request->validate([
            'community_id' => 'required|exists:communities,id',
            'user_id' => 'required|exists:users,id',
            'notification_id' => 'required|exists:notifications,id',
        ]);

        // Verifica si la notificación aún existe
        $notification = DatabaseNotification::find($request->notification_id);
        if (!$notification) {
            return back()->with('info', 'Esta solicitud ya fue procesada por otro administrador.');
        }

        // Asegura que el membership exista y actualiza el rol
        $communityMembership = CommunityMembership::where('community_id', $request->community_id)
            ->where('user_id', $request->user_id)
            ->firstOrFail();

        $communityMembership->update(['community_role_id' => 3]);

        // Elimina todas las notificaciones relacionadas con esta solicitud
        DatabaseNotification::whereRaw("data::json->>'requester_id' = ?", [(string) $request->user_id])
            ->whereRaw("data::json->>'community_id' = ?", [(string) $request->community_id])
            ->whereRaw("data::json->>'type' = ?", ['request'])
            ->delete();

        // Notifica al usuario que fue aceptado
        $requester = User::findOrFail($request->user_id);
        $community = Community::findOrFail($request->community_id);
        $requester->notify(new CommunityAccepted($community));

        return back()->with('success', 'Solicitud aceptada y notificaciones eliminadas.');
    }


    public function deny(Request $request)
    {
        $request->validate([
            'community_id' => 'required|exists:communities,id',
            'user_id' => 'required|exists:users,id',
            'notification_id' => 'required|exists:notifications,id',
        ]);

        $notificaciones = DatabaseNotification::whereRaw("data::json->>'requester_id' = ?", [(string) $request->user_id])
            ->whereRaw("data::json->>'community_id' = ?", [(string) $request->community_id])
            ->whereRaw("data::json->>'type' = ?", ['request']);


        if (!$notificaciones->exists()) {
            return back();
        }

        $notificaciones->delete();
        $communityMembership = CommunityMembership::where('community_id', $request->community_id)
            ->where('user_id', $request->user_id)
            ->firstOrFail();

        $communityMembership->delete();

        $requester = User::findOrFail($request->user_id);
        $community = Community::findOrFail($request->community_id);
        $requester->notify(new CommunityDenied($community));

        return back();
    }

    public function members($communityId)
    {
        $community = Community::with(['memberships' => function ($query) {
            $query->where('community_role_id', '!=', 4);
        }, 'memberships.user.profileImage', 'memberships.user.backgroundImage'])->findOrFail($communityId);

        $community->getTotalMembers = $community->getTotalMembers();
        $community->getTotalPosts = $community->getTotalPosts();

        $user = User::findOrFail(Auth::user()->id);

        $authUserRole = $community->memberships
            ->firstWhere('user_id', $user->id)
            ?->community_role_id;

        return Inertia::render('Communities/Members', [
            'community' => $community,
            'authUserRole' => $authUserRole,
        ]);
    }

    public function makeAdmin(Request $request)
    {


        $request->validate([
            'community_id' => 'required|exists:communities,id',
            'user_id' => 'required|exists:users,id',
        ]);

        CommunityMembership::where('community_id', $request->community_id)
            ->where('user_id', $request->user_id)
            ->update(['community_role_id' => 2]); // Rol admin

        return back();
    }

    public function removeAdmin(Request $request)
    {


        $request->validate([
            'community_id' => 'required|exists:communities,id',
            'user_id' => 'required|exists:users,id',
        ]);

        CommunityMembership::where('community_id', $request->community_id)
            ->where('user_id', $request->user_id)
            ->update(['community_role_id' => 3]); // Rol admin

        return back();
    }

    public function kickUser(Request $request){

        $request->validate([
            'community_id' => 'required|exists:communities,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $community = Community::findOrFail($request->community_id);
        $user = User::findOrFail($request->user_id);

        foreach ($user->posts as $post) {
            if ($post->posteable->communities->contains($community->id)) {
                $post->posteable->communities()->detach($community->id);
            }
        }

        $community->memberships()->where('user_id', $user->id)->delete();

        return back();

    }
}
